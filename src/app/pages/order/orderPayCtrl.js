(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.order')
        .controller('OrderPayCtrl', OrderPayCtrl);

    /** @ngInject */
    function OrderPayCtrl($scope, $rootScope, $transition$, $state, $http, $q, $filter, $uibModal, $interval, $window, $document, screenSize, toastr, dataService, URL, authenticationService, themeLayoutSettings) {

        $rootScope.titleText = '趣西藏 - 支付订单';
        $scope.params = $transition$.params();
        $scope.payChannel = 'alipay';
        $scope.saving = true;

        $scope.selectPayChannel = function (name) {
            $scope.payChannel = name;
        };


        if ($scope.params.id !== undefined) {
            $http.post(URL.assemble(URL.ACTIVITY_ORDERS, 1, 1), {equals: [{eqobj: $scope.params.id, field: "id"}]}).then(function (response) {

                if (response.data.data.content.length > 0) {
                    $scope.order = response.data.data.content[0];
                } else {
                    $state.go('order.list');
                }
                console.log($scope.order);

                if ($scope.order.status !== 'Created') {
                    $state.go('order.detail', {id: $scope.order.id});
                }
                $scope.saving = false;

            }, function (response) {
                dataService.error(response);
                $state.go('order.list');
            });
        }

        $scope.paySumbit = function () {
            $scope.saving = true;

            if ($scope.payChannel === 'alipay' && themeLayoutSettings.mobile) {
                $http.post(URL.get(URL.ACTIVITY_PAYINFO_FROM_ORDER_ALIPAY), {applicationId: $scope.order.id, type: 'WEB_MOBILE'}).then(function (response) {
                    document.open();
                    document.write(response.data.data.form);
                    document.close();
                }, function (response) {
                    dataService.error(response);
                });
            } else if ($scope.payChannel === 'alipay' && !themeLayoutSettings.mobile) {

                $http.post(URL.get(URL.ACTIVITY_PAYINFO_FROM_ORDER_ALIPAY), {applicationId: $scope.order.id, type: 'WEB_SCAN'}).then(function (response) {

                    console.log(response.data.data);

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/templates/showWechatQRCodeModal.html',
                        controller: 'wechatQRCodePayCtrl',
                        resolve: {
                            data: function () {
                                return {
                                    data: response.data.data,
                                    amount: $scope.order.actuallyCost,
                                    title: '支付宝扫码支付',
                                    desc: ['请使用支付宝扫一扫', '扫描二维码支付']
                                };
                            }
                        }
                    });

                    var interval = $interval(function () {
                        $http.post(URL.assemble(URL.ACTIVITY_ORDERS, 1, 1), {equals: [{eqobj: $scope.params.id, field: "id"}]}).then(function (response) {
                            if (response.data.data.content.length > 0) {

                                var status = response.data.data.content[0].status;
                                if (status !== 'Created') {
                                    if (status === 'Paid') {
                                        dataService.successOrder = response.data.data.content[0];
                                        modalInstance.close();
                                        $state.go('order.success');
                                    }
                                    $interval.cancel(interval);
                                }
                            }
                        }, function (response) {
                            console.log(response);
                        });
                    }, 3000);

                    modalInstance.result.then(function () {
                        $interval.cancel(interval);
                        $scope.saving = false;
                    }, function () {
                        $interval.cancel(interval);
                        $scope.saving = false;

                    });


                }, function (response) {
                    dataService.error(response);
                });

            } else if ($scope.payChannel === 'wechat') {
                $http.post(URL.get(URL.ACTIVITY_PAYINFO_FROM_ORDER), {applicationId: $scope.order.id, type: 'NATIVE'}).then(function (response) {

                    console.log(response.data.data);

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/templates/showWechatQRCodeModal.html',
                        controller: 'wechatQRCodePayCtrl',
                        resolve: {
                            data: function () {
                                return {
                                    data: response.data.data,
                                    amount: $scope.order.actuallyCost,
                                    title: '微信扫码支付',
                                    desc: ['请使用微信扫一扫', '扫描二维码支付']
                                };
                            }
                        }
                    });

                    var interval = $interval(function () {
                        $http.post(URL.assemble(URL.ACTIVITY_ORDERS, 1, 1), {equals: [{eqobj: $scope.params.id, field: "id"}]}).then(function (response) {
                            if (response.data.data.content.length > 0) {

                                var status = response.data.data.content[0].status;
                                if (status !== 'Created') {
                                    if (status === 'Paid') {
                                        dataService.successOrder = response.data.data.content[0];
                                        modalInstance.close();
                                        $state.go('order.success');
                                    }
                                    $interval.cancel(interval);
                                }
                            }
                        }, function (response) {
                            console.log(response);
                        });
                    }, 3000);

                    modalInstance.result.then(function () {
                        $interval.cancel(interval);
                        $scope.saving = false;
                    }, function () {
                        $interval.cancel(interval);
                        $scope.saving = false;

                    });


                }, function (response) {
                    dataService.error(response);
                });
            }


        };
    }

})();
