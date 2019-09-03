(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.home')
        .controller('HomeCtrl', HomeCtrl);

    /** @ngInject */
    function HomeCtrl($scope, $rootScope, $transition$, $anchorScroll, $http, $q, $state, $uibModal, $timeout, $window, $document, screenSize, toastr, dataService, URL, authenticationService) {

        var windowEl = angular.element($window);
        $scope.params = $transition$.params();

        $scope.dataService = dataService;
        $scope.swiper = {};
        $scope.slides = [];

        $scope.travelogues = [];
        $scope.travelogueKeywords = [];
        $scope.travelogueTotal = 0;
        $scope.traveloguesLoading = false;

        $scope.routines = [];
        $scope.routineKeywords = [];
        $scope.routineTotal = 0;
        $scope.routinesLoading = false;
        $rootScope.titleText = '趣西藏';
        var keywordQuery = {sorts: [{direction: 0, field: 'amount'}]};

        var loadTravelogues = function (pageNum, pageSize, query) {
            var deferred = $q.defer();
            $http.post(URL.assemble(URL.TRAVELOGUES_QUERY, pageNum, pageSize), query).then(function (response) {
                $scope.travelogues = response.data.data;
                if (angular.equals({}, query)) {
                    $scope.travelogueTotal = $scope.travelogues.totalElements;
                }
                angular.forEach($scope.travelogues.content, function (travelogue) {

                    var url = URL.USERS_ID;
                    if (travelogue.ownerType === 'Admin') {
                        url = URL.ADMINS_ID;
                    }

                    $http.get(URL.assemble(url, travelogue.ownerId)).then(function (response) {
                        travelogue.author = response.data.data;
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
        var loadRoutines = function (pageNum, pageSize, query) {
            var deferred = $q.defer();
            $http.post(URL.assemble(URL.ARTICLES_QUERY, pageNum, pageSize), query).then(function (response) {
                $scope.routines = response.data.data;
                if (angular.equals({}, query)) {
                    $scope.routineTotal = $scope.routines.totalElements;
                }
                angular.forEach($scope.routines.content, function (routine) {

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

        $http.post(URL.assemble(URL.TRAVELOGUES_QUERY, 1, 1), {}).then(function (response) {
            $scope.travelogueTotal = response.data.data.totalElements;
        }, function (error) {
            console.log(error);
        });
        $http.post(URL.assemble(URL.ARTICLES_QUERY, 1, 1), {}).then(function (response) {
            $scope.routineTotal = response.data.data.totalElements;
        }, function (error) {
            console.log(error);
        });

        loadTravelogues(1, 6, $scope.params.tKeyword !== undefined ? {keyWordIds: [$scope.params.tKeyword], sorts: [{direction: 0, field: 'weight'}]} : {sorts: [{direction: 0, field: 'weight'}]});
        loadRoutines(1, 6, $scope.params.rKeyword !== undefined ? {
            keyWordIds: [
                $scope.params.rKeyword
            ],
            equals: [
                {
                    eqobj: 0,
                    field: "type"
                }
            ],
            sorts: [
                {
                    direction: 0,
                    field: 'weight'
                }
            ]
        } : {
            equals: [
                {
                    eqobj: 0,
                    field: "type"
                }
            ],
            sorts: [
                {
                    direction: 0,
                    field: 'weight'
                }
            ]
        });

        $http.post(URL.assemble(URL.TRAVELOGUES_KEYWORDS, 1, 7), keywordQuery).then(function (response) {
            $scope.travelogueKeywords = response.data.data;
        }, function (response) {
            console.log(response);
        });
        $http.post(URL.assemble(URL.ARTICLES_KEYWORDS, 1, 7), keywordQuery).then(function (response) {
            $scope.routineKeywords = response.data.data;
        }, function (response) {
            console.log(response);
        });


        $scope.slides_lg = [
            {
                url: 'https://temporary-1253467197.picgz.myqcloud.com/92160dcc2af3456695b7fac8984158d0png?imageView2/1/w/1920/h/580',
                link: 'article.view',
                params: {id: 'f8cdbb2f5bf6c115015c3dbdc2eb0000'}
            }
            ,
            {
                url: 'https://temporary-1253467197.picgz.myqcloud.com/7412cd26184d499f9427e29275625112jpg?imageView2/1/w/1920/h/580',
                link: 'article.view',
                params: {id: 'f8cdbb2f5bf6c115015c8b5e7ba90001'}
            }
            ,
            {
                url: 'https://temporary-1253467197.picgz.myqcloud.com/68f022860fab40fa9752731f9cf05059jpg?imageView2/1/w/1920/h/580',
                link: 'article.view',
                params: {id: 'f8cdbb2f5b6a8d67015b894175440002'}
            }
        ];

        $scope.slides_sm = [
            {
                url: 'https://temporary-1253467197.picgz.myqcloud.com/92160dcc2af3456695b7fac8984158d0png?imageView2/1/w/768/h/408',
                link: 'article.view',
                params: {id: 'f8cdbb2f5bf6c115015c3dbdc2eb0000'}
            },
            {
                url: 'https://temporary-1253467197.picgz.myqcloud.com/7412cd26184d499f9427e29275625112jpg?imageView2/1/w/768/h/408',
                link: 'article.view',
                params: {id: 'f8cdbb2f5bf6c115015c8b5e7ba90001'}
            },
            {
                url: 'https://temporary-1253467197.picgz.myqcloud.com/68f022860fab40fa9752731f9cf05059jpg?imageView2/1/w/768/h/408',
                link: 'article.view',
                params: {id: 'f8cdbb2f5b6a8d67015b894175440002'}
            }
        ];
        $scope.currentTab = 'routines';

        $scope.slides = screenSize.is('md, lg') ? $scope.slides_lg : $scope.slides_sm;

        $scope.nav = function (image) {
            $state.go(image.link, image.params);
        };


        this.uiOnParamsChanged = function (newParams, transition) {
            $scope.params = transition.params();

            if (newParams.hasOwnProperty('tab')) {
                if (newParams.tab !== undefined) {
                    if (screenSize.is('md, lg')) {
                        $anchorScroll('homeCategoryAnchor');
                    }
                }

                if (newParams.tab === 'travelogues') {

                }
            }

            if (newParams.hasOwnProperty('tKeyword')) {
                if (newParams.tKeyword !== undefined) {
                    loadTravelogues(1, 6, {keyWordIds: [newParams.tKeyword], sorts: [{direction: 0, field: 'weight'}]});
                }
                else {
                    loadTravelogues(1, 6, {sorts: [{direction: 0, field: 'weight'}]});
                }
                if (screenSize.is('md, lg')) {
                    $anchorScroll('homeCategoryAnchor');
                }
            }

            if (newParams.hasOwnProperty('rKeyword')) {
                if (newParams.rKeyword !== undefined) {
                    loadRoutines(1, 6, {keyWordIds: [newParams.rKeyword], sorts: [{direction: 0, field: 'weight'}]});
                }
                else {
                    loadRoutines(1, 6, {sorts: [{direction: 0, field: 'weight'}]});
                }
                if (screenSize.is('md, lg')) {
                    $anchorScroll('homeCategoryAnchor');
                }
            }
        };

        $scope.moreKeywords = function (tabName) {

            if (tabName === undefined || tabName !== 'travelogues') {
                $http.post(URL.assemble(URL.ARTICLES_KEYWORDS, $scope.routineKeywords.number + 2, 7), keywordQuery).then(function (response) {
                    var keywords = response.data.data;
                    keywords.content = $scope.routineKeywords.content.concat(keywords.content);
                    $scope.routineKeywords = keywords;
                }, function (response) {
                    console.log(response);
                });
            }

            if (tabName === 'travelogues') {
                $http.post(URL.assemble(URL.TRAVELOGUES_KEYWORDS, $scope.travelogueKeywords.number + 2, 7), keywordQuery).then(function (response) {
                    var keywords = response.data.data;
                    keywords.content = $scope.travelogueKeywords.content.concat(keywords.content);
                    $scope.travelogueKeywords = keywords;
                }, function (response) {
                    console.log(response);
                });
            }

        };


        $scope.moreTravelogues = function () {

            $scope.traveloguesLoading = true;

            var query = {sorts: [{direction: 0, field: 'weight'}]};
            if ($scope.params.tKeyword !== undefined) {
                query = {keyWordIds: [$scope.params.tKeyword], sorts: [{direction: 0, field: 'weight'}]};
            }

            $http.post(URL.assemble(URL.TRAVELOGUES_QUERY, $scope.travelogues.number + 2, 6), query).then(function (response) {

                var travelogues = response.data.data;
                if (angular.equals({}, query)) {
                    $scope.travelogueTotal = travelogues.totalElements;
                }
                angular.forEach(travelogues.content, function (travelogue) {

                    var url = URL.USERS_ID;
                    if (travelogue.ownerType === 'Admin') {
                        url = URL.ADMINS_ID;
                    }

                    $http.get(URL.assemble(url, travelogue.ownerId)).then(function (response) {
                        travelogue.author = response.data.data;
                    }, function (response) {
                        console.log(response);
                    });
                });
                travelogues.content = $scope.travelogues.content.concat(travelogues.content);
                $scope.travelogues = travelogues;
                $scope.traveloguesLoading = false;

            }, function (error) {
                console.log(error);
                $scope.traveloguesLoading = false;
            });

        };

        $scope.moreRoutines = function () {

            $scope.routinesLoading = true;

            var query = {
                equals: [
                    {
                        eqobj: 0,
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
            if ($scope.params.rKeyword !== undefined) {
                query = {
                    keyWordIds: [$scope.params.rKeyword],
                    equals: [
                        {
                            eqobj: 0,
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
            }

            $http.post(URL.assemble(URL.ARTICLES_QUERY, $scope.routines.number + 2, 6), query).then(function (response) {

                var routines = response.data.data;
                if (angular.equals({}, query)) {
                    $scope.routineTotal = routines.totalElements;
                }
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
                routines.content = $scope.routines.content.concat(routines.content);
                $scope.routines = routines;
                $scope.routinesLoading = false;

            }, function (error) {
                console.log(error);
                $scope.routinesLoading = false;
            });

        };

    }

})();
