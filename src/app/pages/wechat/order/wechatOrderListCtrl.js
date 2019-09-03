(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.wechat')
        .controller('WechatOrderListCtrl', WechatOrderListCtrl);

    /** @ngInject */
    function WechatOrderListCtrl($scope, $rootScope, $transition$, $state, $http, $q, $filter, $uibModal, $timeout, $window, $document, screenSize, toastr, dataService, URL, authenticationService, themeLayoutSettings) {

        $rootScope.titleText = '趣西藏 - 订单列表';
        $scope.params = $transition$.params();
        $scope.saving = true;
        $scope.ordersLoading = false;

        $scope.order = {
            activityId: $scope.params.id,
            pits: 1
        };

        var loadOrders = function (pageNum, pageSize, query) {
            $http.post(URL.assemble(URL.ACTIVITY_ORDERS, pageNum, pageSize), query).then(function (response) {
                $scope.orders = response.data.data;
                $scope.ordersLoading = false;
            }, function (response) {
                alert(angular.toJson(response.data.message));
            });
        };
        loadOrders(1, 6, {sorts: [{direction: 0, field: "createDate"}]});

        $scope.moreOrders = function () {
            $scope.ordersLoading = true;
            $http.post(URL.assemble(URL.ACTIVITY_ORDERS, $scope.orders.number + 2, 6), {sorts: [{direction: 0, field: "createDate"}]}).then(function (response) {
                var orders = response.data.data;
                orders.content = $scope.orders.content.concat(orders.content);
                $scope.orders = orders;
                $scope.ordersLoading = false;
            }, function (response) {
                alert(angular.toJson(response.data.message));
            });
        };


        $scope.payOrder = function (order) {

            if (themeLayoutSettings.isWechat) {
                return $q(function (resolve, reject) {

                    $http.get(URL.assemble(URL.ACTIVITY_PAYINFO, order.id, 'WeChatPayInPublic')).then(function (response) {
                        WeixinJSBridge.invoke('getBrandWCPayRequest', {
                            "appId": response.data.data.appId,
                            "timeStamp": String(response.data.data.timeStamp),
                            "nonceStr": response.data.data.nonceStr,
                            "package": response.data.data.package,
                            "signType": response.data.data.signType,
                            "paySign": response.data.data.paySign
                        }, function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                $state.go('wechat.order.success');
                            } else {
                                if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                    $state.go('wechat.order.failed');
                                } else {
                                    $state.go('wechat.order.failed');
                                }
                            }
                        });
                    }, function (response) {
                        alert(angular.toJson(response.data.message));
                    });

                });
            } else {
                $state.go('order.pay', {id: order.id});
            }

        };

        $scope.applyRefund = function (order) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/templates/dangerConfirm.html',
                controller: 'ConfirmDeleteCtrl',
                resolve: {
                    message: function () {
                        return '确认申请退款吗？操作不可恢复哦！';
                    }
                }
            });

            modalInstance.result.then(function () {
                $http({
                    method: 'POST',
                    url: URL.assemble(URL.ACTIVITY_REFUND_APPLY, order.id),
                    data: 'remark=' + '我需要退款，理由是：（用户暂未填写，请电话联系客户）',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    loadOrders(1, 6, {sorts: [{direction: 0, field: "createDate"}]});
                }, function (error) {
                    alert(angular.toJson(response.data.message));
                });
            });
        }

    }

})();
