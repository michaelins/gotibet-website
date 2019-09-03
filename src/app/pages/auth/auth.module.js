(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.auth', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                views:{
                    'frame':{
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@auth':{
                        template: '<ui-view></ui-view>'
                    }
                },
                abstract: true
            })
            .state('auth.login', {
                url: '/login',
                templateUrl: 'app/pages/auth/login.html',
                controller: 'AuthCtrl'
            })
            .state('auth.admin', {
                url: '/admin',
                templateUrl: 'app/pages/auth/adminLogin.html',
                controller: 'AuthCtrl'
            })
            .state('auth.register', {
                url: '/register',
                templateUrl: 'app/pages/auth/register.html',
                controller: 'AuthCtrl'
            })
            .state('auth.forget', {
                url: '/forget',
                templateUrl: 'app/pages/auth/forget.html',
                controller: 'AuthCtrl'
            });
    }

})();
