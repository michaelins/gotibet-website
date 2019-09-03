/**
 * Created by Shawn on 2017/2/25.
 */
angular.module('GoTibetWebsite')
    .directive('nodeGenerator', function ($q, $http, $timeout, $uibModal, $filter, FileUploader, toastr, authenticationService, dataService, URL) {
        return {
            restrict: 'E',
            templateUrl: 'app/templates/nodeGenerator.html',
            scope: {
                content: '=?'
            },
            link: function (scope, element, attrs) {

                scope.showRemoveBtn = function () {
                    if (attrs.showRemoveBtn !== undefined && attrs.showRemoveBtn === 'false') {
                        return false;
                    }
                    else {
                        return true;
                    }
                };

                scope.addSection = function () {
                    var index = Number(attrs.index);
                    if (index < 0) {
                        index = -1;
                    }
                    scope.content.splice(index + 1, 0, {section: ''});
                };

                scope.addText = function () {
                    var index = Number(attrs.index);
                    if (index < 0) {
                        index = -1;
                    }
                    scope.content.splice(index + 1, 0, {text: ''});
                };

                scope.removeNode = function () {
                    scope.content.splice(Number(attrs.index), 1);
                };

                var uploader = scope.uploader = new FileUploader({
                    url: URL.get(URL.TEMP_IMAGE_UPLOAD),
                    headers: {'Authorization': 'Bearer ' + authenticationService.getStoredToken()},
                    alias: 'file',
                    autoUpload: true
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

                uploader.onAfterAddingAll = function (addedItems) {

                    var index = Number(attrs.index);
                    if (index < 0) {
                        index = -1;
                    }

                    var i = 1;
                    angular.forEach(addedItems, function (item) {
                        scope.content.splice(index + i, 0, {
                            image: '',
                            caption: '',
                            uploaded: false,
                            progress: 0
                        });
                        item.node = scope.content[index + i];
                        i++;
                    });

                };

                uploader.onProgressItem = function (item, progress) {
                    item.node.progress = progress;
                };

                uploader.onSuccessItem = function (item, response, status, headers) {
                    console.log(response);
                    item.node.image = response.data;
                    item.node.uploaded = true;
                };
                uploader.onErrorItem = function (fileItem, response, status, headers) {
                    console.log(response);
                    toastr.error('图片上传失败，请稍后再试');
                };


            }
        }
    });