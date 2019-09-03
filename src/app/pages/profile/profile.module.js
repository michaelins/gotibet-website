(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.profile', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('profile', {
                url: '/profile',
                views:{
                    'frame':{
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@profile':{
                        template: '<ui-view></ui-view>'
                    }
                },
                abstract: true
            })
            .state('profile.info', {
                url: '/info',
                templateUrl: 'app/pages/profile/info.html',
                controller: 'ProfileCtrl'
            })
            .state('profile.password', {
                url: '/password',
                templateUrl: 'app/pages/profile/password.html',
                controller: 'ProfileCtrl'
            })
            .state('profile.mobile', {
                url: '/mobile',
                templateUrl: 'app/pages/profile/mobile.html',
                controller: 'ProfileCtrl'
            })
        ;
    }

})();
