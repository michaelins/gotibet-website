(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.home', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/home?tab&query&name&rKeyword&tKeyword',
                params: {
                    tab: {dynamic: true},
                    query: {dynamic: true},
                    name: {dynamic: true},
                    rKeyword: {dynamic:true},
                    tKeyword: {dynamic:true}
                },
                views: {
                    'frame': {
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@home': {
                        templateUrl: 'app/pages/home/home.html',
                        controller: 'HomeCtrl'
                    }
                },
                title: '首页'
            });
    }

})();
