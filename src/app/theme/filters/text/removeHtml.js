/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite.theme')
        .filter('plainText', plainText);

    /** @ngInject */
    function plainText() {
        return function (text) {
            // var removedTags = text ? String(text).replace(/<[^>]+>/gm, '') : '';
            //
            // return removedTags? String(removedTags).replace(/&[^\s]*;/,''):'';
            var el;
            try {
                el = angular.element(text);
                if (el && el.length !== 0) {
                    var plain = '';
                    angular.forEach(el, function (item) {
                        plain += item.innerText || item.textContent;
                    });
                    return plain;
                } else {
                    return text;
                }
            } catch (error) {
                // console.log(error);
                return text;
            }

        };
    }

})();
