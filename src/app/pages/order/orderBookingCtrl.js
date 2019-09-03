(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.order')
        .controller('OrderBookingCtrl', OrderBookingCtrl);

    /** @ngInject */
    function OrderBookingCtrl($scope, $rootScope, $transition$, $state, $http, $q, $filter, $uibModal, $timeout, $window, $document, screenSize, toastr, dataService, URL, authenticationService) {

        $rootScope.titleText = '趣西藏 - 填写订单';
        $scope.params = $transition$.params();
        $scope.saving = true;

        $scope.order = {
            activityId: $scope.params.id,
            pits: 1
        };

        $scope.pitAdd = function () {
            if (!$scope.order.pits || $scope.saving) {
                return;
            }
            $scope.order.pits += 1;

        };

        $scope.pitMinus = function () {
            if (!$scope.order.pits || $scope.order.pits === 1 || $scope.saving) {
                return;
            }
            $scope.order.pits -= 1;
        };


        if ($scope.params.id !== undefined) {
            $http.get(URL.assemble(URL.ACTIVITIES_ID, $scope.params.id)).then(function (response) {

                $scope.activity = response.data.data;
                $scope.activity.isOngoing = moment(Date.parse(response.headers("Date"))).isBefore(moment($scope.activity.deadline));

                if(!$scope.activity.isOngoing) {
                    $state.go('activity.all');
                }
                $scope.order.contactPhone = authenticationService.getClaims().mobile;
                $scope.saving = false;

            }, function (response) {
                console.log(response);
            });

        }

        $scope.bookSubmit = function (form) {

            var hasError = false;
            $scope.bookingError = false;
            form.$setSubmitted();
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$invalid) {
                hasError = true;
            }

            if (hasError) {
                return $q(function (resolve, reject) {
                    reject();
                });
            }

            $scope.saving = true;

            return $q(function (resolve, reject) {

                $scope.order.actuallyCost = $scope.activity.applicationCost * $scope.order.pits;
                $http.post(URL.assemble(URL.ACTIVITY_APPLICATIONS), $scope.order).then(function (response) {
                    $state.go('order.pay',{id:response.data.data.id});
                }, function (response) {

                    // $scope.bookingError = true;
                    $scope.saving = false;
                    // $scope.bookingErrorMessage = response.data.message;
                    dataService.error(response);

                });
            });
        };
    }

})();
