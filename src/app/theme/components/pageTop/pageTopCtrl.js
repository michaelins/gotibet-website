/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite.theme.components')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($scope, $http, $state, dataService, URL, authenticationService, layoutPaths, themeLayoutSettings) {

        $scope.dataService = dataService;
        $scope.authenticationService = authenticationService;
        $scope.isNavCollapsed = true;
        $scope.themeLayoutSettings = themeLayoutSettings;

        if (!authenticationService.hasStoredToken()) {
            $http.post(URL.get(URL.USERS)).then(function (response) {
                if (response.data.data) {
                    authenticationService.setLocalToken(response.data.data);
                }
            }, function (response) {
                console.log(response);
            });
        }

        $scope.logout = function (state) {
            authenticationService.logout();

            $http.post(URL.get(URL.USERS)).then(function (response) {
                if (response.data.data) {
                    authenticationService.setLocalToken(response.data.data);
                }
            }, function (response) {
                console.log(response);
            });

            $state.go(state);
        };

    }
})();