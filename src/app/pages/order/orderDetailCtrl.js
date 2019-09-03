(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.order')
        .controller('OrderDetailCtrl', OrderDetailCtrl);

    /** @ngInject */
    function OrderDetailCtrl($scope, $rootScope, $transition$, $state, $http, $q, $filter, $uibModal, $interval, $window, $document, screenSize, toastr,  dataService, URL, authenticationService) {

        $rootScope.titleText = '趣西藏 - 查看订单';
        $scope.params = $transition$.params();

        var loadOrder = function () {
            $http.post(URL.assemble(URL.ACTIVITY_ORDERS, 1, 1), {equals: [{eqobj: $scope.params.id, field: "id"}]}).then(function (response) {

                if (response.data.data.content.length > 0) {
                    $scope.order = response.data.data.content[0];
                } else {
                    $state.go('order.list');
                }

            }, function (response) {
                dataService.error(response);
                $state.go('order.list');
            });
        };
        if ($scope.params.id !== undefined) {
            loadOrder();
        }

        $scope.applyRefund = function () {

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
                    url: URL.assemble(URL.ACTIVITY_REFUND_APPLY, $scope.order.id),
                    data: 'remark=' + '我需要退款，理由是：（用户暂未填写，请电话联系客户）',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    loadOrder();
                }, function (error) {
                    alert(angular.toJson(response.data.message));
                });
            });
        }

    }

})();
