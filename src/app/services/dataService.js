(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .factory('dataService', dataService);

    /** @ngInject */
    function dataService($http, $state, $q, $window, $location, $filter, $uibModal, toastr, URL) {

        var service = {};

        service.state = $state;

        service.ERROR_CONNECTION_REFUSED = '无法连接到服务器';

        // service.fetch = function (url, data) {
        //     var deferred = $q.defer();
        //     $http.get(url, data).success(function (result) {
        //         if (result) {
        //             deferred.resolve(result);
        //         }
        //     }).error(function (result) {
        //         deferred.reject(result);
        //     });
        //     return deferred.promise;
        // };
        //
        // service.post = function (url, data) {
        //     var deferred = $q.defer();
        //     $http.post(url, data).success(function (result) {
        //         // if (result) {
        //         deferred.resolve(result);
        //         // }
        //     }).error(function (result) {
        //         deferred.reject(result);
        //     });
        //     return deferred.promise;
        // };
        //
        // service.delete = function (url, data) {
        //     var deferred = $q.defer();
        //     $http.delete(url, data).success(function (result) {
        //         deferred.resolve(result);
        //     }).error(function (result) {
        //         deferred.reject(result);
        //     });
        //     return deferred.promise;
        // };
        service.error = function (response) {
            toastr.error((null != response.data) ? response.data.message : service.ERROR_CONNECTION_REFUSED);
        };

        service.reverseResourceIds = function (selectedItems, type) {
            var libraryUploadDeferred = $q.defer();
            if (selectedItems.length > 0) {
                var libraryUploads = {
                    mongoids: [],
                    type: type
                };
                angular.forEach(selectedItems, function (item) {
                    libraryUploads.mongoids.push(item.id);
                });

                $http.post(URL.assemble(URL.RESOURCES_REVERSE), libraryUploads).then(function (response) {
                    // angular.forEach(response.data, function (item) {
                    //     $scope.dataService.newCoterie.toimgs.push({'imgid': item});
                    // });
                    libraryUploadDeferred.resolve(response.data);
                }, function (response) {
                    service.error(response);
                    libraryUploadDeferred.reject(response);
                    $scope.saving = false;
                });
            } else {
                libraryUploadDeferred.resolve();
            }
            return libraryUploadDeferred.promise;
        };

        service.shareWeibo = function (title, pic) {
            var wb_share_data = {
                url: encodeURIComponent($location.$$absUrl),
                title: title,
                pic: encodeURIComponent(pic)
            };
            var wb_share_url = 'http://service.weibo.com/share/share.php?url=' + wb_share_data.url + '&type=button&ralateUid=6171700743&language=zh_cn&appkey=1336539611&title=' + wb_share_data.title + '&pic=' + wb_share_data.pic + '&searchPic=false&style=simple';
            $window.open(wb_share_url, '', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
        };

        service.shareQzone = function (title, pic, summary) {
            var filteredSummary = $filter('plainText')(summary);
            filteredSummary = filteredSummary.length > 200 ? filteredSummary.substring(0, 200) + '...' : filteredSummary;
            var qzone_share_data = {
                url: encodeURIComponent($location.$$absUrl),
                summary: encodeURIComponent(filteredSummary),
                title: encodeURIComponent(title),
                pics: encodeURIComponent(pic)
            };
            var qzone_share_url = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + qzone_share_data.url + '&summary=' + qzone_share_data.summary + '&title=' + qzone_share_data.title + '&pics=' + qzone_share_data.pics;
            $window.open(qzone_share_url, '', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
        };

        service.shareWechat = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/templates/showWechatQRCodeModal.html',
                controller: 'wechatQRCodePayCtrl',
                resolve: {
                    data: function () {
                        return {
                            data: {
                                code_url: $location.$$absUrl
                            },
                            title: '分享到微信',
                            desc: ['请使用微信扫一扫', '扫描二维码在微信中打开并分享']
                        };
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        };

        return service;
    }

})();