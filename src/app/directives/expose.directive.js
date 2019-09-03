/**
 * Created by Shawn on 2016/11/16.
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .directive('expose', function () {
            return {
                require: 'stTable',
                link: function (scope, element, attr, ctrl) {
                    if (attr.expose != '') {
                        scope.$parent[attr.expose] = ctrl.tableState();
                    } else {
                        scope.$parent.smartTableState = ctrl.tableState();
                    }
                }
            };
        });

    angular.module('GoTibetWebsite')
        .directive('fetchvar', function () {
            return {
                require: 'stTable',
                link: function (scope, element, attr, ctrl) {
                    if (attr.fetchvar != '') {
                        // scope.$parent[attr.expose] = ctrl.tableState();
                        ctrl.tableState().fetchvar = attr.fetchvar;
                    }
                }
            };
        });
})();