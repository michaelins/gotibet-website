(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.wechat')
        .controller('WechatAuthCtrl', WechatAuthCtrl);

    /** @ngInject */
    function WechatAuthCtrl($scope, $rootScope, $q, $interval, $http, $state, $transition$, $window, themeLayoutSettings, dataService, URL, authenticationService) {

        $scope.dataService = dataService;
        $scope.authenticationService = authenticationService;
        $scope.btnCodeMessage = null;
        $scope.codeInCoolDown = false;
        $scope.params = $transition$.params();

        if ($state.$current.name === 'auth.admin') {
            $rootScope.titleText = '趣西藏 - 管理员登录';
        } else if ($state.$current.name === 'wechat.auth.login') {
            $rootScope.titleText = '趣西藏 - 登录';
        } else if ($state.$current.name === 'auth.register') {
            $rootScope.titleText = '趣西藏 - 注册';
        }

        if ($scope.params.secret !== undefined) {
            $http.get(URL.assemble(URL.WECHAT_SECRET_FOR_OPENID, $scope.params.secret)).then(function (response) {
                if (response.data.data) {
                    authenticationService.saveOpenID(response.data.data);
                }
            }, function (error) {
                alert(angular.toJson(error.data.message));
            });
        } else {
            $window.location.href = URL.WECHAT_LOGIN;
        }

        $scope.sendCode = function (form) {

            var hasError = false;
            form.mobile.$setDirty();
            if (form.mobile.$invalid) {
                hasError = true;
            }

            if (!hasError) {
                $http.post(URL.assemble(URL.CHECK_CODE, $scope.user.mobile)).then(function (response) {
                    console.log(response);
                    $scope.codeInCoolDown = true;
                    $scope.seconds = 60;
                    $scope.btnCodeMessage = $scope.seconds + "秒后重发";
                    var interval = $interval(function () {
                        $scope.seconds = $scope.seconds - 1;
                        if ($scope.seconds == 0) {
                            $interval.cancel(interval);
                            $scope.btnCodeMessage = null;
                            $scope.codeInCoolDown = false;
                        } else {
                            $scope.btnCodeMessage = $scope.seconds + "秒后重发";
                        }
                    }, 1000);
                }, function (response) {
                    $scope.codeError = true;
                    if (response.headers("X-Code") == 10002) {
                        $scope.codeErrorMessage = '操作过于频繁，请稍后再试';
                    } else {
                        $scope.codeErrorMessage = '短信服务异常';
                    }
                });
            }

        };
        $scope.register = function (form) {

            var hasError = false;
            $scope.registerError = false;
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
                $http.post(URL.assemble(URL.USER_REG_OR_LOGIN, $scope.user.mobile, $scope.user.code)).then(function (response) {

                    authenticationService.saveToken(response.data.data);

                    //TODO: redirect
                    // $state.go('wechat.order.booking', {id: 'f8cdbb2f5b3c33e8015b3c9e0ac10000'});
                    $state.go('activity.all');

                }, function (response) {
                    alert(angular.toJson(response.data.message));

                    $scope.registerError = true;
                    $scope.saving = false;

                    if (Number(response.headers("X-Code")) === 10006) {
                        $scope.registerErrorMessage = '验证码无效或已过期';
                    } else {
                        $scope.registerErrorMessage = response.data.message;
                    }
                });
            });
        };

    }
})();