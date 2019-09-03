/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages', [
        'ui.router',
        'GoTibetWebsite.pages.auth',
        'GoTibetWebsite.pages.profile',
        'GoTibetWebsite.pages.home',
        'GoTibetWebsite.pages.activity',
        'GoTibetWebsite.pages.article',
        'GoTibetWebsite.pages.travelogue',
        'GoTibetWebsite.pages.news',
        'GoTibetWebsite.pages.order',
        'GoTibetWebsite.pages.about',
        'GoTibetWebsite.pages.contact',
        'GoTibetWebsite.pages.wechat'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    }

})();
