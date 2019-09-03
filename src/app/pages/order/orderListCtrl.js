(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.order')
        .controller('OrderListCtrl', OrderListCtrl);

    /** @ngInject */
    function OrderListCtrl($scope, $rootScope, $transition$, $location, $http, $q, $filter, $uibModal, $interval, $window, $document, screenSize, toastr,  dataService, URL, authenticationService) {

        $rootScope.titleText = '趣西藏 - 订单列表';
        $scope.params = $transition$.params();
        $scope.pagination = {
            currentPage: 1,
            itemsPerPage: 6
        };

        var createDateDescQuery = {sorts: [{direction: 0, field: "createDate"}]};
        var loadOrders = function (pageNum, pageSize, query) {
            $http.post(URL.assemble(URL.ACTIVITY_ORDERS, pageNum, pageSize), query).then(function (response) {
                $scope.orders = response.data.data;
            }, function (response) {
                dataService.error(response);
            });
        };
        loadOrders(1, 6, createDateDescQuery);

        $scope.loadOrders = function (pageNum) {
            loadOrders(pageNum, $scope.pagination.itemsPerPage, createDateDescQuery);
        };

        $scope.payOrder = function (order) {

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
                    $scope.loadOrders($scope.pagination.currentPage);
                }, function (error) {
                    dataService.error(error);
                });
            });
        }
    }

})();
