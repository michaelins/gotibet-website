(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.about', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('about', {
                url: '/about',
                views: {
                    'frame': {
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@about': {
                        templateUrl: 'app/pages/about/about.html'
                    }
                }
            });
    }

})();
