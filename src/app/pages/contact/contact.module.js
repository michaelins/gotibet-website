(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.contact', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('contact', {
                url: '/contact',
                views: {
                    'frame': {
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@contact': {
                        templateUrl: 'app/pages/contact/contact.html'
                    }
                }
            });
    }

})();
