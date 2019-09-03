(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .controller('ConfirmWarningCtrl', ConfirmWarningCtrl);

    /** @ngInject */
    function ConfirmWarningCtrl($scope, message) {
        $scope.message = message;
    }

})();
