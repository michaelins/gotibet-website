(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.wechat')
        .controller('WechatOrderSuccessCtrl', WechatOrderSuccessCtrl);

    /** @ngInject */
    function WechatOrderSuccessCtrl($scope, $rootScope, $transition$, $state, $http, $q, $filter, $uibModal, $interval, $window, $document, screenSize, toastr,  dataService, URL, authenticationService) {

        $rootScope.titleText = '趣西藏 - 预定成功！';

        $scope.seconds = 5;
        var interval = $interval(function () {
            var seconds = $scope.seconds - 1;
            if (seconds === 0) {
                $interval.cancel(interval);
                $state.go('wechat.order.list');
            }else{
                $scope.seconds = seconds;
            }
        }, 1000);

    }

})();
