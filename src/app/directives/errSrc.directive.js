/**
 * Created by Shawn on 2016/11/16.
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .directive('errSrc', function() {
            return {
                link: function(scope, element, attrs) {
                    element.bind('error', function() {
                        if (attrs.src != attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }
                    });
                }
            }
        });
})();