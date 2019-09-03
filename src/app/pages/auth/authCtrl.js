/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.auth')
        .controller('AuthCtrl', AuthCtrl);

    /** @ngInject */
    function AuthCtrl($scope, $rootScope, $q, $interval, $http, $state, $window, dataService, URL, authenticationService, $uibModal) {

        $scope.dataService = dataService;
        $scope.authenticationService = authenticationService;
        $scope.btnCodeMessage = null;
        $scope.codeInCoolDown = false;

        if ($state.$current.name === 'auth.admin') {
            $rootScope.titleText = '趣西藏 - 管理员登录';
        } else if ($state.$current.name === 'auth.login') {
            $rootScope.titleText = '趣西藏 - 登录';
        } else if ($state.$current.name === 'auth.register') {
            $rootScope.titleText = '趣西藏 - 注册';
        }

        $scope.sendCode = function (form) {

            var hasError = false;
            form.mobile.$setDirty();
            if (form.mobile.$invalid) {
                hasError = true;
            }

            if (!hasError) {
                $http.post(URL.assemble(URL.CHECK_CODE, $scope.user.mobile)).then(function (response) {
                    console.log(response);
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

        $scope.register = function (form) {
            var hasError = false;
            $scope.registerError = false;
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
                $http.put(URL.assemble(URL.REGISTER, $scope.user.code), $scope.user).then(function (response) {

                    $http.post(URL.get(URL.LOGIN_MOBILE), $scope.user).then(function (response) {
                        authenticationService.saveToken(response.data.data);
                        $scope.saving = false;
                        $state.go('home');
                    }, function (response) {
                        $scope.registerError = true;
                        $scope.saving = false;
                        if (response.headers("X-Code") == 10008) {
                            $scope.registerErrorMessage = '帐号不存在或密码错误';
                        } else {
                            $scope.registerErrorMessage = '登录失败，请稍后再试';
                        }
                    });

                }, function (response) {
                    $scope.registerError = true;
                    $scope.saving = false;

                    if (response.headers("X-Code") == 10003) {
                        $scope.registerErrorMessage = '此手机号已注册';
                    } else {
                        $scope.registerErrorMessage = '注册失败，请稍后再试';
                    }
                });
            });
        };

        $scope.login = function (form) {

            var hasError = false;
            $scope.loginError = false;
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
                $http.post(URL.get(URL.LOGIN_MOBILE), $scope.user).then(function (response) {
                    authenticationService.saveToken(response.data.data);
                    $scope.saving = false;
                    $state.go('home');
                }, function (response) {
                    $scope.loginError = true;
                    $scope.saving = false;
                    if (response.headers("X-Code") == 10008) {
                        $scope.loginErrorMessage = '帐号不存在或密码错误';
                    } else {
                        $scope.loginErrorMessage = '登录失败，请稍后再试';
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
                        $state.go('home');
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
                    $scope.forgetError = true;
                    $scope.saving = false;

                    if (response.headers("X-Code") == 10008) {
                        $scope.forgetErrorMessage = '帐号不存在或验证码错误';
                    } else {
                        $scope.forgetErrorMessage = '密码找回失败，请稍后再试';
                    }
                });
            });
        };

        $scope.adminLogin = function (form) {

            var hasError = false;
            $scope.loginError = false;
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
                $http.post(URL.get(URL.ADMIN_LOGIN), $scope.user).then(function (response) {
                    authenticationService.saveToken(response.data.data);
                    $scope.saving = false;
                    $state.go('home');
                }, function (response) {
                    $scope.loginError = true;
                    $scope.saving = false;
                    if (response.headers("X-Code") == 10008) {
                        $scope.loginErrorMessage = '帐号不存在或密码错误';
                    } else {
                        $scope.loginErrorMessage = '登录失败，请稍后再试';
                    }
                });
            });
        };

        $scope.wechatLogin = function () {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/templates/showOAuthQRCodeModal.html',
                resolve: {
                    message: function () {
                        return '';
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.saving = false;
            }, function () {
                $scope.saving = false;
            });

        };

        $scope.weiboLogin = function () {
            $window.open('https://api.weibo.com/oauth2/authorize?client_id=1336539611&response_type=code&redirect_uri=https://www.qzang.cc/weibo_oauth.html', '_blank');
            // $window.open('http://localhost:3000/weibo_oauth.html', '_blank');
        };

        $scope.qqLogin = function () {
            $window.open('https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101388943&redirect_uri=https://www.qzang.cc/qq_oauth.html', '_blank');
        };
    }
})();