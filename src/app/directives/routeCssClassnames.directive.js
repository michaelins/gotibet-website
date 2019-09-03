(function () {
    'use strict';

    angular.module('GoTibetWebsite').directive('routeCssClassnames', routeCssClassnames);

    function routeCssClassnames($rootScope,$transitions) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, elem, attr, ctrl) {

                $transitions.onBefore({
                    to: function (state) {
                        return true;
                    }
                }, function (trans) {
                    var fromState = trans.from();
                    var toState = trans.to();

                    var fromClassnames = angular.isDefined(fromState.data) && angular.isDefined(fromState.data.cssClassnames) ? fromState.data.cssClassnames : null;
                    var toClassnames = angular.isDefined(toState.data) && angular.isDefined(toState.data.cssClassnames) ? toState.data.cssClassnames : null;

                    // don't do anything if they are the same
                    if (fromClassnames != toClassnames) {
                        if (fromClassnames) {
                            elem.removeClass(fromClassnames);
                        }

                        if (toClassnames) {
                            elem.addClass(toClassnames);
                        }
                    }
                });
            }
        }
    }
}());