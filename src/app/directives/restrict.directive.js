/**
 * Created by Shawn on 2016/11/16.
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .directive('restrict', restrictDirective);

    /** @ngInject */
    function restrictDirective(authenticationService) {
        return {
            restrict: 'A',
            prioriry: 100000,
            scope: false,
            link: function () {
                // alert('ergo sum!');
            },
            compile: function (element, attr, linker) {
                var accessDenied = !authenticationService.hasAccessToFunction(attr.function);
                if (accessDenied) {
                    element.children().remove();
                    element.remove();
                }

            }
        };
    }
})();