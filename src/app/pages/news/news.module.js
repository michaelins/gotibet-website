(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.news', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('news', {
                url: '/news',
                views:{
                    'frame':{
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@news':{
                        template: '<ui-view></ui-view>'
                    }
                },
                abstract: true
            })
            .state('news.all', {
                url: '/all',
                templateUrl: 'app/pages/news/newsList.html',
                controller: 'NewListCtrl'
            });
    }

})();
