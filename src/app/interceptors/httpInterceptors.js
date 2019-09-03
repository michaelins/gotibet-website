(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .factory('httpInterceptors', httpInterceptors);

    /** @ngInject */
    function httpInterceptors($q, $window, $state, authenticationService,themeLayoutSettings, URL) {
        var httpInterceptors = {
            'request': function (config) {
                if (authenticationService.hasStoredToken()) {
                    config.headers['Authorization'] = 'Bearer ' + authenticationService.getStoredToken();
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    if (themeLayoutSettings.isWechat) {
                        $window.location.href = URL.WECHAT_LOGIN;
                    }else{
                        $state.go('auth.login');
                    }
                }
                return $q.reject(response);
            }
        };

        return httpInterceptors;
    };


    angular.module('GoTibetWebsite').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptors');
    }]);

})();