(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    /** @ngInject */
    function ProfileCtrl($scope, $rootScope, $http, $q, $filter, $timeout, $state, $interval, authenticationService, FileUploader, toastr, dataService, URL) {

        if ($state.$current.name === 'profile.info') {
            $rootScope.titleText = '趣西藏 - 修改基本资料';
        } else if ($state.$current.name === 'profile.password') {
            $rootScope.titleText = '趣西藏 - 修改密码';
        }

        $scope.datepickerOptions = {
            "singleDatePicker": true,
            "showDropdowns": true,
            "locale": {
                "format": "YYYY-MM-DD",
                "separator": " - ",
                "applyLabel": "Apply",
                "cancelLabel": "Cancel",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Custom",
                "weekLabel": "W",
                "daysOfWeek": [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六"
                ],
                "monthNames": [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                "firstDay": 1
            }
        };

        $scope.saving = false;
        $scope.avatarSaving = false;
        $scope.hasError = false;
        $scope.user = {
            birthday: {startDate: moment(), endDate: moment()}
        };
        $scope.username = authenticationService.getUsername();
        $scope.userid = authenticationService.getUserId();
        $scope.admin = {};

        $http.get(URL.assemble(URL.USERS_ID, authenticationService.getClaims().userId)).then(function (response) {
            $scope.user.nickName = response.data.data.nickName;
            $scope.user.gender = response.data.data.gender;
            if (response.data.data.birthday) {
                $scope.user.birthday = response.data.data.birthday;
            }
        }, function (error) {
            console.log(error);
        });


        $scope.passwordEquals = function () {
            if ($scope.admin) {
                if (typeof $scope.admin.password != 'undefined' && typeof $scope.admin.confirmPassword != 'undefined') {
                    return $scope.admin.password == $scope.admin.confirmPassword;
                }
            }
            return true;
        };

        $scope.myImage = 'http://localhost:3000/assets/img/app/profile/Nasta.png';
        $scope.myCroppedImage = '';
        $scope.cropped = {
            source: 'http://vignette2.wikia.nocookie.net/tomandjerry/images/6/6d/Tom-tom-and-jerry.png'
        };

        $scope.fileChanged = function () {
            var file = event.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };

        var uploader = $scope.uploader = new FileUploader({
            url: URL.get(URL.TEMP_IMAGE_UPLOAD),
            headers: {'Authorization': 'Bearer ' + authenticationService.getStoredToken()},
            alias: 'file'
        });
        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        uploader.onWhenAddingFileFailed = function () {
            toastr.error('请选择支持的图片文件 (jpg,png,jpeg,bmp,gif) 进行上传。');
        };
        uploader.onAfterAddingFile = function (item) {
            console.info('onAfterAddingFile', item);
            var obj = uploader.queue[uploader.queue.length - 1];
            $scope.cropped = {image: ''};
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.$apply(function () {
                    $scope.image = event.target.result;
                });
            };
            reader.readAsDataURL(item._file);
        };

        uploader.onBeforeUploadItem = function (item) {
            var blob = dataURItoBlob($scope.cropped.image);
            item.file.name = 'cropped.png';
            item._file = blob;
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {

            $http({
                method: 'PUT',
                url: URL.get(URL.USERS_AVATAR),
                data: 'avatar=' + response.data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {

                $http.post(URL.get(URL.USERS_NEW_TOKEN)).then(function (response) {
                    console.log(response);
                    authenticationService.refreshToken(response.data.data);
                    $scope.cropped.image = undefined;
                    uploader.clearQueue();
                    uploader.headers = {'Authorization': 'Bearer ' + authenticationService.getStoredToken()};
                    toastr.success('头像上传成功');

                }, function (error) {
                    console.log(error);
                });
            }, function (error) {
                console.log(error);
            });

            $scope.avatarSaving = false;
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };

        var dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                byteString = atob(dataURI.split(',')[1]);
            } else {
                byteString = decodeURI(dataURI.split(',')[1]);
            }
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < byteString.length; i++) {
                array.push(byteString.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: mimeString});
        };

        $scope.saveAvatar = function () {
            $scope.avatarSaving = true;
            uploader.uploadItem(uploader.queue[uploader.queue.length - 1]);
        };

        $scope.progressFunction = function (valid) {
            if (valid) {
                $scope.saving = true;
                return $q(function (resolve, reject) {
                    $http.post(URL.get(URL.ADMINS_PROFILE), $scope.admin).then(function (response) {
                        $timeout(function () {
                            resolve();
                            $scope.saving = false;
                            toastr.success('个人资料已保存');
                        }, 1000);
                    }, function (response) {
                        dataService.error(response);
                        reject();
                        $scope.saving = false;
                    });
                });
            }
        };


        $scope.sendCode = function (form) {

            var hasError = false;
            form.mobile.$setDirty();
            if (form.mobile.$invalid) {
                hasError = true;
            }

            if (!hasError) {
                $http.post(URL.assemble(URL.CHECK_CODE, $scope.user.mobile)).then(function (response) {
                    $scope.codeInCoolDown = true;
                    $scope.seconds = 60;
                    $scope.btnCodeMessage = $scope.seconds + "秒后重发";
                    var interval = $interval(function () {
                        $scope.seconds = $scope.seconds - 1;
                        if ($scope.seconds == 0) {
                            $interval.cancel(interval);
                            $scope.btnCodeMessage = null;
                            $scope.codeInCoolDown = false;
                        } else {
                            $scope.btnCodeMessage = $scope.seconds + "秒后重发";
                        }
                    }, 1000);
                }, function (response) {
                    $scope.codeError = true;
                    if (response.headers("X-Code") == 10002) {
                        $scope.codeErrorMessage = '操作过于频繁，请稍后再试';
                    } else {
                        $scope.codeErrorMessage = '短信服务异常';
                    }
                });
            }

        };

        $scope.updateInfo = function (form) {
            var hasError = false;
            form.$setSubmitted();
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$invalid) {
                hasError = true;
            }

            if (hasError) {
                return $q(function (resolve, reject) {
                    reject();
                });
            }

            $scope.saving = true;

            return $q(function (resolve, reject) {
                $http.put(URL.get(URL.USERS_INFO), $scope.user).then(function (response) {

                    $http.post(URL.get(URL.USERS_NEW_TOKEN)).then(function (response) {
                        authenticationService.refreshToken(response.data.data);
                        toastr.success('基本资料已保存');
                        $scope.saving = false;
                    }, function (error) {
                        console.log(error);
                    });

                }, function (error) {
                    console.log(error);
                    $scope.saving = false;
                    if (error.headers("X-Code") == 10008) {
                        toastr.error('帐号不存在或验证码错误');
                    } else {
                        dataService.error(error);
                    }
                });
            });
        };

        $scope.forget = function (form) {

            var hasError = false;
            $scope.forgetError = false;
            form.$setSubmitted();
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$invalid) {
                hasError = true;
            }

            if (hasError) {
                return $q(function (resolve, reject) {
                    reject();
                });
            }

            $scope.saving = true;

            return $q(function (resolve, reject) {
                $http.put(URL.assemble(URL.FORGET_PASSWORD, $scope.user.code), $scope.user).then(function (response) {

                    $http.post(URL.get(URL.LOGIN_MOBILE), $scope.user).then(function (response) {
                        authenticationService.saveToken(response.data.data);
                        $scope.saving = false;
                        $scope.user = {};
                        form.mobile.$setPristine();
                        form.code.$setPristine();
                        form.password.$setPristine();
                        toastr.success('密码修改成功');

                    }, function (response) {
                        $scope.forgetError = true;
                        $scope.saving = false;
                        if (response.headers("X-Code") === '10008') {
                            $scope.forgetErrorMessage = '帐号不存在或密码错误';
                        } else {
                            $scope.forgetErrorMessage = '登录失败，请稍后再试';
                        }
                    });

                }, function (response) {
                    $scope.forgetError = true;
                    $scope.saving = false;

                    if (response.headers("X-Code") === '10008') {
                        $scope.forgetErrorMessage = '帐号不存在或验证码错误';
                    } else if (response.headers("X-Code") === '10006') {
                        $scope.forgetErrorMessage = '验证码无效或已过期';
                    }
                });
            });
        };

        $scope.bindMobile = function (form) {

            var hasError = false;
            $scope.forgetError = false;
            form.$setSubmitted();
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$invalid) {
                hasError = true;
            }

            if (hasError) {
                return $q(function (resolve, reject) {
                    reject();
                });
            }

            $scope.saving = true;

            return $q(function (resolve, reject) {
                $http.put(URL.assemble(URL.BIND_MOBILE, $scope.user.code), $scope.user).then(function (response) {

                    $http.post(URL.get(URL.LOGIN_MOBILE), $scope.user).then(function (response) {
                        authenticationService.saveToken(response.data.data);
                        $scope.saving = false;
                        $scope.user = {};
                        form.mobile.$setPristine();
                        form.code.$setPristine();
                        form.password.$setPristine();
                        toastr.success('绑定手机成功');

                    }, function (response) {
                        $scope.forgetError = true;
                        $scope.saving = false;
                        if (response.headers("X-Code") == 10008) {
                            $scope.forgetErrorMessage = '帐号不存在或密码错误';
                        } else {
                            $scope.forgetErrorMessage = '登录失败，请稍后再试';
                        }
                    });

                }, function (response) {
                    $scope.saving = false;

                    dataService.error(response);
                });
            });
        };

    }
})();
