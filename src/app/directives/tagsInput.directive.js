/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .directive('tagInput', tagInput);

    /** @ngInject */
    function tagInput($filter) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                $(elem).tagsinput({
                    tagClass: 'label label-' + attr.tagInput
                });

                if (attr.ngModel) {
                    scope.$watch(attr.ngModel, refresh);
                }

                function refresh() {
                    var obj = scope.$eval(attr.ngModel);
                    if (!obj && scope.$parent) {
                        obj = scope.$parent.$eval(attr.ngModel);
                    }
                    if (!obj && scope.$parent.$parent) {
                        obj = scope.$parent.$parent.$eval(attr.ngModel);
                    }
                    if (!obj && scope.$parent.$parent.$parent) {
                        obj = scope.$parent.$parent.$parent.$eval(attr.ngModel);
                    }
                    if (!obj && scope.$parent.$parent.$parent.$parent) {
                        obj = scope.$parent.$parent.$parent.$parent.$eval(attr.ngModel);
                    }
                    $(elem).tagsinput('removeAll');
                    if (obj) {
                        angular.forEach(obj.split(','), function (item) {
                            $(elem).tagsinput('add', item);
                        });
                    }
                }

            }
        };
    }
})();