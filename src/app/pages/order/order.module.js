(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.order', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('order', {
                url: '/order',
                views:{
                    'frame':{
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@order':{
                        template: '<ui-view></ui-view>'
                    }
                },
                abstract: true
            })
            .state('order.booking', {
                url: '/booking/:id',
                templateUrl: 'app/pages/order/booking.html',
                controller: 'OrderBookingCtrl'
            })
            .state('order.pay', {
                url: '/pay/:id',
                templateUrl: 'app/pages/order/orderPay.html',
                controller: 'OrderPayCtrl'
            })
            .state('order.success', {
                url: '/success',
                templateUrl: 'app/pages/order/orderSuccess.html',
                controller: 'OrderSuccessCtrl'
            })
            .state('order.detail', {
                url: '/detail/:id',
                templateUrl: 'app/pages/order/orderDetail.html',
                controller: 'OrderDetailCtrl'
            })
            .state('order.list', {
                url: '/list',
                templateUrl: 'app/pages/order/orderList.html',
                controller: 'OrderListCtrl'
            });
    }

})();
