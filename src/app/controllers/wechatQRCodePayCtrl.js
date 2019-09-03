(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .controller('wechatQRCodePayCtrl', wechatQRCodePayCtrl);

    /** @ngInject */
    function wechatQRCodePayCtrl($scope, data) {
        $scope.data = data;
    }

})();
