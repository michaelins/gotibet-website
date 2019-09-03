(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.activity')
        .controller('ActivityViewCtrl', ActivityViewCtrl);

    /** @ngInject */
    function ActivityViewCtrl($scope, $state, $transition$, $rootScope, $http, $location, $filter, $uibModal, $timeout, $window, $document, screenSize, toastr, dataService, URL, themeLayoutSettings) {

        $scope.dataService = dataService;
        $scope.params = $transition$.params();
        $scope.dynamicPopover = {
            templateUrl: 'myPopoverTemplate.html'
        };
        $scope.activity = {};
        $scope.activity.content = [];

        if ($scope.params.id !== undefined) {
            $http.get(URL.assemble(URL.ACTIVITIES_ID, $scope.params.id)).then(function (response) {

                response.data.data.content = angular.fromJson(response.data.data.content);
                $scope.activity = response.data.data;

                var sections = [];
                var currentSection = {
                    id: 0,
                    content: undefined,
                    nodes: []
                };
                angular.forEach($scope.activity.content, function (node) {
                    if (node.section === undefined) {
                        currentSection.nodes.push(node);
                    }
                    else {
                        sections.push(currentSection);
                        var id = currentSection.id + 1;
                        currentSection = {
                            id: id,
                            content: node,
                            nodes: []
                        };
                    }
                });
                sections.push(currentSection);
                $scope.activity.sections = sections;
                $scope.activity.texts = $filter('filter')($scope.activity.content, function (node) {
                    return node.text !== undefined;
                });
                $scope.activity.isOngoing = moment(Date.parse(response.headers("Date"))).isBefore(moment($scope.activity.deadline));
                $rootScope.titleText = $scope.activity.title;

                var share_url = $location.$$absUrl;
                share_url = share_url.split('#')[0];
                $http.get(URL.get(URL.WECHAT_JSSDK) + '?url=' + share_url).then(function (response) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: response.data.data.appid, // 必填，公众号的唯一标识
                        timestamp: String(response.data.data.getSecondTimestamp), // 必填，生成签名的时间戳
                        nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串
                        signature: response.data.data.signature,// 必填，签名，见附录1
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });

                    var filteredSummary = $filter('plainText')($scope.activity.texts && $scope.activity.texts.length > 0 ? $scope.activity.texts[0].text : $scope.activity.title);
                    filteredSummary = filteredSummary.length > 200 ? filteredSummary.substring(0, 200) + '...' : filteredSummary;

                    wx.ready(function () {
                        wx.onMenuShareAppMessage({
                            title: $scope.activity.title, // 分享标题
                            desc: filteredSummary, // 分享描述
                            link: $location.$$absUrl, // 分享链接
                            imgUrl: $scope.activity.coverImg, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                console.log('yes');
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                console.log('no');
                            }
                        });
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    });
                }, function (response) {
                    console.log(response);
                });

            }, function (response) {
                console.log(response);
            });

            $http.get(URL.assemble(URL.ACTIVITY_APPLICATION_AMOUNT, $scope.params.id)).then(function (response) {
                if (response.data.data === undefined || response.data.data === null) {
                    $scope.applicationAmount = 0;
                } else {
                    $scope.applicationAmount = response.data.data;
                }
            }, function (error) {
                console.log(error);
            });
        }

        $scope.deleteActivity = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/templates/dangerConfirm.html',
                controller: 'ConfirmDeleteCtrl',
                resolve: {
                    message: function () {
                        return '确认删除活动吗？操作不可恢复哦！';
                    }
                }
            });

            modalInstance.result.then(function () {
                $http.delete(URL.assemble(URL.ACTIVITIES_ID, $scope.params.id)).then(function (response) {
                    toastr.success('活动已删除');
                    $state.go('activity.all');
                }, function (error) {
                    dataService.error(error);
                    console.log(error);
                });
            });

        };

        $scope.applyActivity = function () {

            if (themeLayoutSettings.mobile) {
                $state.go('wechat.order.booking', {id: $scope.activity.id});
            } else {
                $state.go('order.booking', {id: $scope.activity.id});
            }
        };
    }

})();
