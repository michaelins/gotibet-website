(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .controller('ConfirmDeleteCtrl', ConfirmDeleteCtrl);

    /** @ngInject */
    function ConfirmDeleteCtrl($scope, message) {
        $scope.message = message;
    }

})();
