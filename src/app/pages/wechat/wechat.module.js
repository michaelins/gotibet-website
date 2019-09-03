(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.wechat', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('wechat', {
                url: '/wechat',
                views: {
                    'frame': {
                        templateUrl: 'app/pages/frame.html'
                    },
                    'content@wechat':{
                        template: '<ui-view></ui-view>'
                    }
                },
                abstract: true
            })
            .state('wechat.auth', {
                url: '/auth',
                abstract: true
            })
            .state('wechat.auth.login', {
                url: '/login?secret',
                params: {
                    secret: {dynamic: true}
                },
                templateUrl: 'app/pages/wechat/auth/login.html',
                controller: 'WechatAuthCtrl'
            })
            .state('wechat.order', {
                url: '/order',
                abstract: true
            })
            .state('wechat.order.booking', {
                url: '/booking/:id',
                templateUrl: 'app/pages/wechat/order/booking.html',
                controller: 'WechatOrderBookingCtrl'
            })
            .state('wechat.order.list', {
                url: '/list',
                templateUrl: 'app/pages/wechat/order/orderList.html',
                controller: 'WechatOrderListCtrl'
            })
            .state('wechat.order.success', {
                url: '/success',
                templateUrl: 'app/pages/wechat/order/success.html',
                controller: 'WechatOrderSuccessCtrl'
            })
            .state('wechat.order.failed', {
                url: '/failed',
                templateUrl: 'app/pages/wechat/order/failed.html',
                controller: 'WechatOrderFailedCtrl'
            });

        $urlRouterProvider.when('/wechat', '/wechat/auth/login');
    }

})();
