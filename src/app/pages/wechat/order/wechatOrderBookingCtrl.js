(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.wechat')
        .controller('WechatOrderBookingCtrl', WechatOrderBookingCtrl);

    /** @ngInject */
    function WechatOrderBookingCtrl($scope, $rootScope, $transition$, $state, $http, $q, $filter, $uibModal, $timeout, $window, $document, screenSize, toastr,  dataService, URL, authenticationService, themeLayoutSettings) {

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

                console.log(response);
                $scope.activity = response.data.data;
                $scope.activity.isOngoing = moment(Date.parse(response.headers("Date"))).isBefore(moment($scope.activity.deadline));

                $scope.saving = false;

            }, function (response) {
                alert(angular.toJson(response.data.message));
            });

            $scope.order.contactPhone = authenticationService.getClaims().mobile;
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

            if (themeLayoutSettings.isWechat) {
                return $q(function (resolve, reject) {

                    $scope.order.actuallyCost = $scope.activity.applicationCost * $scope.order.pits;
                    console.log(authenticationService.getStoredOpenID());
                    console.log($scope.order);

                    $http.post(URL.assemble(URL.ACTIVITY_WECHAT_BOOKING, authenticationService.getStoredOpenID()), $scope.order).then(function (response) {

                        console.log(response.data.data);

                        WeixinJSBridge.invoke('getBrandWCPayRequest', {
                            "appId": response.data.data.appId,
                            "timeStamp": String(response.data.data.timeStamp),
                            "nonceStr": response.data.data.nonceStr,
                            "package": response.data.data.package,
                            "signType": response.data.data.signType,
                            "paySign": response.data.data.paySign
                        }, function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                $state.go('wechat.order.success');
                            } else {
                                if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                    $state.go('wechat.order.failed');
                                } else {
                                    $state.go('wechat.order.failed');
                                }
                            }
                        });

                    }, function (response) {

                        alert(response.data.message);

                        $scope.bookingError = true;
                        $scope.saving = false;
                        $scope.bookingErrorMessage = response.data.message;

                        if (Number(response.headers("X-Code")) === 10024) {
                            $window.location.href = URL.WECHAT_LOGIN;
                        }

                    });
                });
            }
            else{
                return $q(function (resolve, reject) {

                    $scope.order.actuallyCost = $scope.activity.applicationCost * $scope.order.pits;
                    $http.post(URL.assemble(URL.ACTIVITY_APPLICATIONS), $scope.order).then(function (response) {
                        $state.go('order.pay',{id:response.data.data.id});
                    }, function (response) {
                        $scope.saving = false;
                        dataService.error(response);
                    });
                });
            }
        };
    }

})();
