(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.activity')
        .controller('ActivityAddCtrl', ActivityAddCtrl);

    /** @ngInject */
    function ActivityAddCtrl($scope, $state, $rootScope, $location, $http, $q, $filter, $transition$, $timeout, $window, $document, $sce, dragularService, toastr, FileUploader, dataService, utilService, URL, authenticationService) {

        $scope.params = $transition$.params();
        $scope.dataService = dataService;
        $scope.utilService = utilService;
        $scope.travelogue = {
            deadline: {startDate: moment(), endDate: moment()}
        };
        $scope.travelogue.nodes = [];

        if ($scope.params.id !== undefined) {
            $http.get(URL.assemble(URL.ACTIVITIES_ID, $scope.params.id)).then(function (response) {
                response.data.data.nodes = angular.fromJson(response.data.data.content);
                $scope.travelogue = response.data.data;
                $scope.travelogue.inputPrice = $scope.travelogue.applicationCost / 100;
                $rootScope.titleText = '趣西藏 - 编辑活动';
                dragularService('.node-wrapper', {
                    containersModel: $scope.travelogue.nodes
                });
            }, function (response) {
                console.log(response);
            });
        } else {
            $rootScope.titleText = '趣西藏 - 新建活动';
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
                toastr.error('请完整填写活动标题、上传游记头图，设置活动报名截止时间和报名费用，至少添加一个活动内容节点');
                return $q(function (resolve, reject) {
                    reject();
                });
            }

            $scope.saving = true;
            var promises = [];

            $q.all(promises).then(function (data) {
                $scope.travelogue.content = angular.toJson($scope.travelogue.nodes, false);
                if (Number($scope.travelogue.applicationCost) === 0) {
                    $scope.travelogue.applicationCostType = 'Free';
                } else {
                    $scope.travelogue.applicationCostType = 'Pay';
                }
                $scope.travelogue.applicationCost = $scope.travelogue.inputPrice * 100;
                if ($scope.params.id !== undefined) {
                    $http.put(URL.get(URL.ACTIVITIES), $scope.travelogue).then(function (response) {
                        toastr.success('保存活动成功');
                        $state.go('activity.view', {id:response.data.data.id});
                    }, function (response) {
                        console.log(response);
                        toastr.error('保存活动失败');
                    });
                } else {
                    $http.post(URL.get(URL.ACTIVITIES), $scope.travelogue).then(function (response) {
                        toastr.success('保存活动成功');
                        $state.go('activity.view', {id:response.data.data.id});
                    }, function (response) {
                        console.log(response);
                        toastr.error('保存活动失败');
                    });
                }
            }).catch(function (data) {
                console.log(data);
            }).finally(function () {
                $scope.saving = false;
            });


        };

        $scope.cover_uploader = new FileUploader({
            url: URL.get(URL.TEMP_IMAGE_UPLOAD),
            headers: {'Authorization': 'Bearer ' + authenticationService.getStoredToken()},
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
            onAfterAddingFile: function (fileItem) {
                $scope.coverImgUploaded = false;
            },
            onProgressItem: function (item, progress) {
                $scope.coverImgProgress = progress;
            },
            onSuccessItem: function (fileItem, response, status, headers) {
                console.log(response);
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
