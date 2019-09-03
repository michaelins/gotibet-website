/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite.theme.components')
        .controller('MsgCenterCtrl', MsgCenterCtrl);

    /** @ngInject */
    function MsgCenterCtrl($scope, $sce, $filter, $state, $http, dataService, URL) {

        $scope.dataService = dataService;

        if (!$scope.dataService.notifications) {
            $scope.dataService.notifications = [];
        }

        $http.get(URL.get(URL.GOEASY)).then(function (response) {
            var goEasy = new GoEasy({
                appkey: response.data.key
            });

            goEasy.subscribe({
                channel: 'd336171fcf9b4fe0a1e7d9861fc4ded7_EXCHANGE_ORDER_TRIGGER',
                onMessage: function (message) {
                    var content =angular.fromJson(message.content);
                    content.username = decodeURI(content.username);
                    console.log(content);
                    $scope.dataService.notifications.push({
                        id: content.id,
                        image: 'assets/img/shopping-cart.svg',
                        template: '用户 ['+content.username+'] 下单了积分兑换商品，点击查看',
                        time: content.sendtime
                    });
                }
            });
        }, function (response) {
            dataService.error(response);
        });

        $scope.getMessage = function (msg) {
            var text = msg.template;
            return $sce.trustAsHtml(text);
        };

        $scope.showAlerts =function () {
          return $scope.dataService.notifications.length > 0;
        };

        $scope.handleMessage = function (msg) {
            console.log(msg);
            $scope.dataService.notifications = $filter('filter')($scope.dataService.notifications, function (item) {
                return item.userId != msg.userId;
            });
            $state.go('exchange.order.get', {id: msg.id});
        };

        $scope.removeAllMessage = function () {
            $scope.dataService.notifications = [];
        };
    }
})();