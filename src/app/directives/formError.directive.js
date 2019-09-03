/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .directive('formError', formError);

    /** @ngInject */
    function formError() {
        return {
            restrict: 'E',
            // controller: 'BlurFeedCtrl',
            scope: {
                message: '=?'
            },
            templateUrl: 'app/templates/formError.html',
            link: function (scope, element, attr, ctrl) {
                if (attr.messageText) {
                    scope.message = attr.messageText;
                }
            }
        };
    }
})();