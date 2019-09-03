/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite.theme')
        .filter('remainDays', remainDays);

    /** @ngInject */
    function remainDays() {
        return function (text) {

            if (text !== undefined) {
                return moment(text).diff(moment(), 'days');
            }

        };
    }

})();
