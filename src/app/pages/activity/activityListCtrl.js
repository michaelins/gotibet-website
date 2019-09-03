(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.activity')
        .controller('ActivityListCtrl', ActivityListCtrl);

    /** @ngInject */
    function ActivityListCtrl($scope, $rootScope, $anchorScroll, $location, $http, $q, $filter, $uibModal, $timeout, $window, $document, screenSize, toastr, dataService, URL, authenticationService) {

        $scope.activities = [];
        $scope.activitiesLoading = false;
        $rootScope.titleText = '趣西藏 - 活动'
        var query = {sorts: [{direction: 0, field: 'weight'}]};

        var loadActivities = function (pageNum, pageSize, query) {
            var deferred = $q.defer();
            $http.post(URL.assemble(URL.ACTIVITIES_QUERY, pageNum, pageSize), query).then(function (response) {
                $scope.activities = response.data.data;
                angular.forEach($scope.activities.content, function (activity) {
                    $http.get(URL.assemble(URL.ACTIVITY_APPLICATION_AMOUNT, activity.id)).then(function (response) {
                        if (response.data.data === undefined || response.data.data === null) {
                            activity.applicationAmount = 0;
                        } else {
                            activity.applicationAmount = response.data.data;
                        }
                    }, function (error) {
                        console.log(error);
                    });
                    activity.isOngoing = moment(Date.parse(response.headers("Date"))).isBefore(moment(activity.deadline));
                });
                deferred.resolve();
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        loadActivities(1, 6, query);

        $scope.moreActivities = function () {

            $scope.activitiesLoading = true;

            $http.post(URL.assemble(URL.ACTIVITIES_QUERY, $scope.activities.number + 2, 3), query).then(function (response) {

                var activities = response.data.data;

                angular.forEach(activities.content, function (activity) {
                    $http.get(URL.assemble(URL.ACTIVITY_APPLICATION_AMOUNT, activity.id)).then(function (response) {
                        if (response.data.data === undefined || response.data.data === null) {
                            activity.applicationAmount = 0;
                        } else {
                            activity.applicationAmount = response.data.data;
                        }
                    }, function (error) {
                        console.log(error);
                    });
                    activity.isOngoing = moment(Date.parse(response.headers("Date"))).isBefore(moment(activity.deadline));
                });

                activities.content = $scope.activities.content.concat(activities.content);
                $scope.activities = activities;
                $scope.activitiesLoading = false;

            }, function (error) {
                console.log(error);
                $scope.activitiesLoading = false;
            });

        };
    }

})();
