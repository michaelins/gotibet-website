/**
 * Created by k.danovsky on 12.05.2016.
 */

(function () {
    'use strict';

    angular.module('GoTibetWebsite.theme')
        .service('themeLayoutSettings', themeLayoutSettings);

    /** @ngInject */
    function themeLayoutSettings(baConfig) {
        var isMobile = (/android|webos|iphone|ipad|ipod|blackberry|windows phone/).test(navigator.userAgent.toLowerCase());
        var isWechat = (/micromessenger/).test(navigator.userAgent.toLowerCase());
        var mobileClass = isMobile ? 'mobile' : '';
        var blurClass = baConfig.theme.blur ? 'blur-theme' : '';
        angular.element(document.body).addClass(mobileClass).addClass(blurClass);

        var headerHeight = isMobile ? 50 : 88;
        var footerHeight = isMobile ? 520 : 220;

        return {
            blur: baConfig.theme.blur,
            mobile: isMobile,
            isWechat: isWechat,
            headerHeight: headerHeight,
            footerHeight: footerHeight
        }
    }

})();