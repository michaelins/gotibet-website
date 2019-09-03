(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.travelogue')
        .controller('TravelogueAddCtrl', TravelogueAddCtrl);

    /** @ngInject */
    function TravelogueAddCtrl($scope, $rootScope, $state, $anchorScroll, $location, $http, $q, $filter, $transition$, $timeout, $window, $document, $sce, dragularService, toastr, themeLayoutSettings, FileUploader, dataService, utilService, URL, authenticationService) {

        $scope.maxSize = $scope.isMobile ? 3 : 5;
        $scope.params = $transition$.params();

        $scope.anchor = function (id) {
            $anchorScroll(id);
            $location.hash(id);
        };

        $document.ready(function () {
            var windowEl = angular.element($window);
            var menuPaddingTop = angular.element('.travelogue-menu').css('padding-top');
            menuPaddingTop = menuPaddingTop.substring(0, menuPaddingTop.length - 2);

            var handler = function () {
                $scope.scrollBottom = $scope.documentHeight - $scope.windowHeight - $scope.scroll;
                if ($scope.scrollBottom < Number(themeLayoutSettings.footerHeight)) {
                    $scope.offsetBottom = Number(themeLayoutSettings.footerHeight) - Number($scope.scrollBottom) + Number(menuPaddingTop) + Number(themeLayoutSettings.headerHeight);
                    angular.element('.travelogue-menu').css('max-height', 'calc(-' + $scope.offsetBottom + 'px + 100%)');
                } else {
                    angular.element('.travelogue-menu').css('max-height', '');
                }
            };
            windowEl.on('scroll', $scope.$apply.bind($scope, handler));
            handler();
        });

        $scope.dataService = dataService;
        $scope.utilService = utilService;
        $scope.travelogue = {};
        $scope.travelogue.keyWordIds = [];
        $scope.travelogue.nodes = [];

        if ($scope.params.id !== undefined) {
            $http.get(URL.assemble(URL.TRAVELOGUES_ID, $scope.params.id)).then(function (response) {
                response.data.data.nodes = angular.fromJson(response.data.data.content);
                $scope.travelogue = response.data.data;
                $scope.travelogue.keyword = $scope.travelogue.keyWords.map(function (item) {
                    return item.content;
                }).join(',');
                $scope.travelogue.keyWordIds = [];
                $rootScope.titleText = '趣西藏 - 编辑游记';
                dragularService('.node-wrapper', {
                    containersModel: $scope.travelogue.nodes
                });

            }, function (response) {
                console.log(response);
            });
        } else {
            $rootScope.titleText = '趣西藏 - 写游记';
            dragularService('.node-wrapper', {
                containersModel: $scope.travelogue.nodes
            });
        }

        $scope.save = function (form) {
            var hasError = false;
            form.$setSubmitted();
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$invalid) {
                hasError = true;
            }

            if (!$scope.travelogue.coverImg) {
                hasError = true;
            }

            if ($scope.travelogue.nodes.length === 0) {
                hasError = true;
            }

            if (hasError) {
                toastr.error('请完整填写游记标题、旅行天数，上传游记头图，至少添加一个关键字和一个游记内容节点');
                return $q(function (resolve, reject) {
                    reject();
                });
            }

            $scope.saving = true;
            var promises = [];
            if ($scope.travelogue.keyword !== undefined) {
                var keywords = $scope.travelogue.keyword.split(',');
                var keywordsDeferredList = [];
                angular.forEach(keywords, function (keyword) {
                    var q = $q.defer();
                    keywordsDeferredList.push(q);
                    promises.push(q.promise);
                });

                angular.forEach(keywords, function (keyword) {
                    var q = keywordsDeferredList.shift();

                    var existedId = undefined;

                    if ($scope.travelogue.keyWords) {
                        angular.forEach($scope.travelogue.keyWords, function (item) {
                            if (existedId === undefined && item.content === keyword) {
                                existedId = item.id;
                            }
                        });
                    }

                    if (existedId !== undefined) {
                        $scope.travelogue.keyWordIds.push(existedId);
                        q.resolve();
                    } else {
                        $http.post(URL.assemble(URL.TRAVELOGUE_KEYWORD, keyword)).then(function (response) {
                            $scope.travelogue.keyWordIds.push(response.data.data.id);
                            q.resolve();
                        }, function (response) {
                            console.log(response);
                            toastr.error('保存关键字失败');
                            q.reject(response);
                        });
                    }

                });
            }

            if ($scope.params.id !== undefined) {
                $q.all(promises).then(function (data) {

                    var url = URL.TRAVELOGUES_USER_UPDATE;
                    if ($scope.travelogue.ownerType === 'Admin') {
                        url = URL.TRAVELOGUES;
                    }

                    $scope.travelogue.content = angular.toJson($scope.travelogue.nodes, false);
                    $http.put(URL.get(url), $scope.travelogue).then(function (response) {
                        toastr.success('保存游记成功');
                        $state.go('travelogue.view', {id: response.data.data.id});
                    }, function (response) {
                        console.log(response);
                        toastr.error('保存游记失败');
                    });
                }).catch(function (data) {
                    console.log(data);
                }).finally(function () {
                    $scope.saving = false;
                });
            } else {
                $q.all(promises).then(function (data) {
                    $scope.travelogue.content = angular.toJson($scope.travelogue.nodes, false);
                    $http.post(URL.get(URL.TRAVELOGUES), $scope.travelogue).then(function (response) {
                        toastr.success('保存游记成功');
                        $state.go('travelogue.view', {id: response.data.data.id});
                    }, function (response) {
                        console.log(response);
                        toastr.error('保存游记失败');
                    });
                }).catch(function (data) {
                    console.log(data);
                }).finally(function () {
                    $scope.saving = false;
                });
            }


        };

        $scope.cover_uploader = new FileUploader({
            url: URL.get(URL.TEMP_IMAGE_UPLOAD),
            alias: 'file',
            autoUpload: true,
            filters: [{
                name: 'imageFilter',
                fn: function (item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            }],
            onWhenAddingFileFailed: function () {
                toastr.error('请选择支持的图片文件 (jpg,png,jpeg,bmp,gif) 进行上传。');
            },
            onAfterAddingFile: function (item) {
                item.headers = {'Authorization': 'Bearer ' + authenticationService.getStoredToken()};
                $scope.coverImgUploaded = false;
            },
            onProgressItem: function (item, progress) {
                $scope.coverImgProgress = progress;
            },
            onSuccessItem: function (fileItem, response, status, headers) {
                $scope.coverImgUploaded = true;
                $scope.coverImgProgress = undefined;
                $scope.travelogue.coverImg = response.data;
            },
            onErrorItem: function (fileItem, response, status, headers) {
                console.log(response);
                toastr.error('图片上传失败，请稍后再试');
            }
        });
    }

})();
