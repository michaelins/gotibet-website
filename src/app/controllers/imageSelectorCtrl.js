(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .controller('ImageSelectorCtrl', ImageSelectorCtrl);

    /** @ngInject */
    function ImageSelectorCtrl($scope, $q, $http, $timeout, $state, $uibModal, $filter, FileUploader, toastr, authenticationService, dataService, URL) {

        var uploader = $scope.uploader = new FileUploader({
            // url: URL.get(URL.FORUM_ADMIN_IMG),
            url: $scope.attrs.url,
            headers: {'Authorization': 'Bearer ' + authenticationService.getStoredToken()},
            alias: 'file'
        });

        console.log($scope);

        $scope.clearQueue = function () {
            $scope.filename = '';
            uploader.clearQueue();
        };

        $scope.removeItem = function (item) {
            item.remove();
            if (uploader.queue.length > 1) {
                $scope.filename = '已选择 ' + uploader.queue.length + ' 个文件';
            } else if (uploader.queue.length == 1) {
                $scope.filename = uploader.queue[0].file.name;
            } else {
                $scope.filename = '';
            }
        };

        // FILTERS

        // uploader.filters.push({
        //     name: 'customFilter',
        //     fn: function (item /*{File|FileLikeObject}*/, options) {
        //         return this.queue.length < 10;
        //     }
        // });
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        uploader.onWhenAddingFileFailed = function() {
            toastr.error('请选择支持的图片文件 (jpg,png,jpeg,bmp,gif) 进行上传。');
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
            if (uploader.queue.length > 1) {
                $scope.filename = '已选择 ' + uploader.queue.length + ' 个文件';
            } else {
                $scope.filename = fileItem.file.name;
            }
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            var editorScope = textAngularManager.retrieveEditor('content').scope;
            editorScope.displayElements.text.trigger('focus');
            editorScope.wrapSelection('insertHTML', '<p><img src=\"' + URL.assemble(URL.IMG_FILE_FETCH, response.mongoid) + '\" style=\"width: 100%\"><br></p>');
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
            toastr.error(response.message, '图片上传失败');
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
            $scope.uploadAllCompleted = true;
            toastr.success('图片全部上传成功');
        };

        /**********************************************************************
         * 素材库选择
         */

        $scope.selectedUploadImageResources = [];

        $scope.popupLibrary = function (type, libraryItemsKey, isMultiple, afterSelectFunc) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/library/modalLibrary.html',
                controller: 'ModalLibraryCtrl',
                size: 'lg',
                resolve: {
                    params: function () {
                        return {
                            type: type,
                            isMultiple:isMultiple
                        };
                    }
                }
            });

            modalInstance.result.then(function (result) {
                angular.forEach(result, function (item) {
                    var existed = $filter('filter')($scope[libraryItemsKey], function (libraryItem) {
                            return item.id == libraryItem.id;
                        }).length > 0;
                    if (!existed) {
                        if(isMultiple) {
                            $scope[libraryItemsKey].push(item);
                        }else {
                            $scope[libraryItemsKey] = [item];
                        }
                    }
                });
                afterSelectFunc();
            });
        };
        $scope.removeLibraryRefItem = function (libraryItemsKey, ref) {
            $scope[libraryItemsKey] = $filter('filter')($scope[libraryItemsKey], function (item) {
                return item.id != ref.id;
            });
        };

        $scope.appendToEditor = function(editorName) {
            console.log(editorName);
            var editorScope = textAngularManager.retrieveEditor('content').scope;
            editorScope.displayElements.text.trigger('focus');
            editorScope.wrapSelection('insertHTML', '<p><img src=\"' + URL.assemble(URL.IMG_FILE_FETCH, $scope.selectedUploadImageResources[0].id) + '\" style=\"width: 100%\"><br></p>');
        };

        /**********************************************************************
         * 素材库选择
         */
    }

})();
