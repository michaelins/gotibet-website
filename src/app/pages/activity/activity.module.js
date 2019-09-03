(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.activity', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('activity', {
                url: '/activity',
                views:{
                    'frame':{
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@activity':{
                        template: '<ui-view></ui-view>'
                    }
                },
                abstract: true
            })
            .state('activity.compose', {
                url: '/compose?id',
                params: {
                    id: {dynamic: true}
                },
                templateUrl: 'app/pages/activity/add.html',
                controller: 'ActivityAddCtrl'
            })
            .state('activity.all', {
                url: '/all',
                templateUrl: 'app/pages/activity/activityList.html',
                controller: 'ActivityListCtrl'
            })
            .state('activity.view', {
                url: '/:id',
                templateUrl: 'app/pages/activity/activity.html',
                controller: 'ActivityViewCtrl'
            });
    }

})();
