(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .factory('authenticationService', authenticationService);

    /** @ngInject */
    function authenticationService($rootScope, $timeout, jwtHelper) {

        var authService = {};
        authService.rememberMe = true;

        authService.setLocalToken = function (data) {
            localStorage.setItem('token', data);
        };

        authService.saveToken = function (data) {
            if (data) {

                if (authService.rememberMe) {
                    // $localStorage.token = data;
                    // delete $sessionStorage.token;
                    localStorage.setItem('token', data);
                    sessionStorage.removeItem('sessionToken');
                }
                else {
                    // $sessionStorage.token = data;
                    // delete $localStorage.token;
                    sessionStorage.setItem('sessionToken', data);
                    localStorage.removeItem('token');
                }
                $timeout(function () {
                    $rootScope.$digest();
                });
            }
        };

        authService.refreshToken = function (data) {
            var local = localStorage.getItem('token');
            var session = sessionStorage.getItem('sessionToken');

            if (local && null != local && 'null' != local) {
                localStorage.setItem('token', data);
            }

            if (session && null != session && 'null' != session) {
                sessionStorage.setItem('sessionToken', data);
            }

            $timeout(function () {
                $rootScope.$digest();
            });
        };

        authService.logout = function () {
            // delete $localStorage.token;
            // sessionStorage.removeItem('token');
            // localStorage.removeItem('token');
            sessionStorage.setItem('sessionToken', null);
            localStorage.setItem('token', null);
        };

        authService.hasStoredToken = function () {
            var token = authService.getStoredToken();
            if (token && !jwtHelper.isTokenExpired(token)) {
                return true;
            }
            return false;
        };

        authService.getStoredToken = function () {
            // console.log($localStorage.token);
            // console.log($sessionStorage.token);
            var local = localStorage.getItem('token');
            var session = sessionStorage.getItem('sessionToken');

            if (local && null != local && 'null' != local) {
                return local;
            }

            if (session && null != session && 'null' != session) {
                return session;
            }
        };

        authService.getClaims = function () {
            var token = authService.getStoredToken();
            var claims = {};
            if (typeof token !== 'undefined' && null != token && !jwtHelper.isTokenExpired(token)) {
                claims = jwtHelper.decodeToken(token);
            }
            return claims;
        };

        authService.isAdmin = function () {
          return authService.getClaims().tokenType === 'ADMIN';
        };

        authService.getUsername = function () {
            var claims = authService.getClaims();
            if (claims && claims.username) {
                return claims.username;
            } else {
                return null;
            }
        };

        authService.getUserId = function () {
            var claims = authService.getClaims();
            if (claims && claims.userid) {
                return claims.userid;
            } else {
                return null;
            }
        };

        authService.hasAccessToFunction = function (data) {
            var claims = authService.getClaims();
            if (claims && claims.permissions) {
                var hasAccess = claims.permissions.filter(function (item) {
                        return item === data;
                    }).length != 0;
                return hasAccess;
            }
            return false;
        };

        authService.saveOpenID = function (data) {
          localStorage.setItem('openid', data);
        };

        authService.hasStoredOpenID = function () {
            if (authService.getStoredOpenID() && authService.getStoredOpenID() !== 'null') {
                return true;
            }
            return false;
        };

        authService.getStoredOpenID = function () {
            return localStorage.getItem('openid');
        };

        return authService;
    }

})();