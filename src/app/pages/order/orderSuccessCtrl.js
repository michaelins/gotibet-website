(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.order')
        .controller('OrderSuccessCtrl', OrderSuccessCtrl);

    /** @ngInject */
    function OrderSuccessCtrl($scope, $rootScope, $transition$, $state, $http, $q, $filter, $uibModal, $interval, $window, $document, screenSize, toastr, dataService, URL, authenticationService) {
        $rootScope.titleText = '趣西藏 - 预定成功！';
        $scope.params = $transition$.params();

        if (dataService.successOrder === undefined) {
            $state.go('order.list');
        }
    }

})();
