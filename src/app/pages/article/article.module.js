(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.article', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('article', {
                url: '/article',
                views:{
                    'frame':{
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@article':{
                        template: '<ui-view></ui-view>'
                    }
                },
                abstract: true
            })
            .state('article.compose', {
                url: '/compose?id',
                params: {
                    id: {dynamic: true}
                },
                templateUrl: 'app/pages/article/add.html',
                controller: 'ArticleAddCtrl'
            })
            .state('article.view', {
                url: '/:id',
                templateUrl: 'app/pages/article/article.html',
                controller: 'ArticleViewCtrl'
            });
    }

})();
