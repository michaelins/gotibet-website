(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.travelogue', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('travelogue', {
                url: '/travelogue',
                views: {
                    'frame': {
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@travelogue': {
                        template: '<ui-view></ui-view>'
                    }
                },
                abstract: true
            })
            .state('travelogue.compose', {
                url: '/compose?id',
                params: {
                    id: {dynamic: true}
                },
                templateUrl: 'app/pages/travelogue/add.html',
                controller: 'TravelogueAddCtrl'
            })
            .state('travelogue.view', {
                url: '/:id',
                templateUrl: 'app/pages/travelogue/travelogue.html',
                controller: 'TravelogueViewCtrl'
            });
    }

})();
