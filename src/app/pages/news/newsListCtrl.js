(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.news')
        .controller('NewListCtrl', NewListCtrl);

    /** @ngInject */
    function NewListCtrl($scope, $rootScope, $anchorScroll, $location, $http, $q, $filter, $uibModal, $timeout, $window, $document, screenSize, toastr, dataService, URL, authenticationService) {

        $scope.news = [];
        $scope.newsLoading = false;
        $rootScope.titleText = '趣西藏 - 趣藏资讯'
        var query = {
            equals: [
                {
                    eqobj: 1,
                    field: "type"
                }
            ],
            sorts: [
                {
                    direction: 0,
                    field: 'weight'
                }
            ]
        };

        var loadNews = function (pageNum, pageSize, query) {
            var deferred = $q.defer();
            $http.post(URL.assemble(URL.ARTICLES_QUERY, pageNum, pageSize), query).then(function (response) {
                $scope.news = response.data.data;
                if (angular.equals({}, query)) {
                    $scope.routineTotal = $scope.news.totalElements;
                }
                angular.forEach($scope.news.content, function (routine) {

                    var url = URL.USERS_ID;
                    if (routine.ownerType === 'Admin') {
                        url = URL.ADMINS_ID;
                    }

                    $http.get(URL.assemble(url, routine.ownerId)).then(function (response) {
                        routine.author = response.data.data;
                    }, function (response) {
                        console.log(response);
                    });
                });
                deferred.resolve();
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        loadNews(1, 6, query);

        $scope.moreNews = function () {

            $scope.newsLoading = true;

            $http.post(URL.assemble(URL.ARTICLES_QUERY, $scope.news.number + 2, 6), query).then(function (response) {

                var routines = response.data.data;
                angular.forEach(routines.content, function (routine) {

                    var url = URL.USERS_ID;
                    if (routine.ownerType === 'Admin') {
                        url = URL.ADMINS_ID;
                    }

                    $http.get(URL.assemble(url, routine.ownerId)).then(function (response) {
                        routine.author = response.data.data;
                    }, function (response) {
                        console.log(response);
                    });
                });
                routines.content = $scope.news.content.concat(routines.content);
                $scope.news = routines;
                $scope.newsLoading = false;

            }, function (error) {
                console.log(error);
                $scope.newsLoading = false;
            });

        };
    }

})();
