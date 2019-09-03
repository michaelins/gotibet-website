/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .directive('selectpicker', selectpicker);

    angular.module('GoTibetWebsite')
        .directive('customOption', customOption);
    function customOption() {
        return{
            restrict: 'A',
            require: '?ngOptions',
            link: {}

        };
    }

    /** @ngInject */
    function selectpicker() {
        return {
            restrict: 'A',
            require: '?ngOptions',
            priority: 1500, // make priority bigger than ngOptions and ngRepeat
            link: {
                pre: function (scope, elem, attrs) {
                    elem.append('<option data-hidden="true" disabled value="">' + (attrs.title || 'Select something') + '</option>')
                },
                post: function (scope, elem, attrs, ngModel) {
                    function refresh() {
                        if(attrs.multiple) {
                            var selectedItems = [];
                            var obj = scope.$parent.$eval(attrs.ngModel);
                            angular.forEach(obj, function (data) {
                                selectedItems.push('string:' + data);
                            });
                            elem.selectpicker('val', selectedItems);
                        }
                        elem.selectpicker('refresh');
                    }

                    if (attrs.ngModel) {
                        scope.$watch(attrs.ngModel, refresh);
                    }

                    if (attrs.ngOptions) {
                        var options = attrs.ngOptions.substring(attrs.ngOptions.lastIndexOf(' in ') + 4);
                        scope.$watch(options, refresh);
                    }

                    if (attrs.ngDisabled) {
                        scope.$watch(attrs.ngDisabled, refresh);
                    }

                    elem.selectpicker({dropupAuto: false, hideDisabled: true});
                }
            }
        };
    }


})();