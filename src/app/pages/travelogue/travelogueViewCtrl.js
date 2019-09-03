(function () {
    'use strict';

    angular.module('GoTibetWebsite.pages.travelogue')
        .controller('TravelogueViewCtrl', TravelogueViewCtrl);

    /** @ngInject */
    function TravelogueViewCtrl($scope, $state, $stateParams, $anchorScroll, $location, $http, $q, $filter, $uibModal, $rootScope, $window, $document, screenSize, toastr, themeLayoutSettings, dataService, URL, authenticationService) {

        $scope.maxSize = $scope.isMobile ? 3 : 5;
        $scope.pagination = {
            currentPage: 1,
            commentsPerPage: 5
        };
        $scope.dynamicPopover = {
            templateUrl: 'myPopoverTemplate.html'
        };
        $scope.anchor = function (id) {
            $anchorScroll(id);
            $location.hash(id);
        };
        $document.ready(function () {
            var windowEl = angular.element($window);
            var menuPaddingTop = angular.element('.travelogue-menu').css('padding-top');
            menuPaddingTop = menuPaddingTop.substring(0, menuPaddingTop.length - 2);

            var handler = function () {
                $scope.scrollBottom = $scope.documentHeight - $scope.windowHeight - $scope.scroll;
                if ($scope.scrollBottom < Number(themeLayoutSettings.footerHeight)) {
                    $scope.offsetBottom = Number(themeLayoutSettings.footerHeight) - Number($scope.scrollBottom) + Number(menuPaddingTop) + Number(themeLayoutSettings.headerHeight);
                    angular.element('.travelogue-menu').css('max-height', 'calc(-' + $scope.offsetBottom + 'px + 100%)');
                } else {
                    angular.element('.travelogue-menu').css('max-height', '');
                }
            };
            windowEl.on('scroll', $scope.$apply.bind($scope, handler));
            handler();

        });
        $scope.dataService = dataService;
        $scope.travelogue = {};
        $scope.travelogue.keyWordIds = [];
        $scope.travelogue.content = [];
        $scope.comment = {};
        $scope.replyComment = {};
        var loadComments = function (pageNum, pageSize, query) {
            $http.post(URL.assemble(URL.TRAVELOGUES_COMMENTS_QUERY, $stateParams.id, pageNum, pageSize), query).then(function (response) {
                $scope.travelogueComments = response.data.data;
                angular.forEach($scope.travelogueComments.content, function (comment) {
                    var url = URL.USERS_ID;
                    if (comment.ownerType === 'Admin') {
                        url = URL.ADMINS_ID;
                    }
                    $http.get(URL.assemble(url, comment.ownerId)).then(function (response) {
                        comment.author = response.data.data;
                    }, function (response) {
                        console.log(response);
                    });

                    if (comment.repliedUserId) {
                        $http.get(URL.assemble(comment.repliedUserType === 'Admin' ? URL.ADMINS_ID : URL.USERS_ID, comment.repliedUserId)).then(function (response) {
                            comment.repliedUser = response.data.data;
                        }, function (response) {
                            console.log(response);
                        });
                    }
                });
            }, function (error) {
                console.log(error);
                dataService.error(error);
            });
        };
        $scope.loadComments = function (pageNum) {
            loadComments(pageNum, $scope.pagination.commentsPerPage, {});
        };

        if ($stateParams.id) {
            $http.get(URL.assemble(URL.TRAVELOGUES_ID, $stateParams.id)).then(function (response) {
                response.data.data.content = angular.fromJson(response.data.data.content);
                $scope.travelogue = response.data.data;

                var sections = [];
                var currentSection = {
                    id: 0,
                    content: undefined,
                    nodes: []
                };
                angular.forEach($scope.travelogue.content, function (node) {
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

                $scope.travelogue.sections = sections;
                $scope.travelogue.images = $filter('filter')($scope.travelogue.content, function (node) {
                    return node.image !== undefined;
                });
                $scope.travelogue.texts = $filter('filter')($scope.travelogue.content, function (node) {
                    return node.text !== undefined;
                });

                // get image info data for photoswipe
                angular.forEach($scope.travelogue.images, function (image) {

                    if ($filter('plainText')(image.caption) !== '点击编辑图片标题') {
                        image.title = image.caption;
                    }

                    if ($scope.isMobile) {
                        image.src = image.image + '?imageView2/0/w/800';
                    } else {
                        image.src = image.image;
                    }

                    var xmlhttp = new XMLHttpRequest();
                    var url = image.image + '?imageInfo';
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                            var info = angular.fromJson(xmlhttp.responseText);
                            var height = Number(info.height);
                            var width = Number(info.width);

                            if ($scope.isMobile) {
                                if (width >= height) {
                                    if (width >= 800) {
                                        image.w = 800;
                                        image.h = Math.round((800 / width) * height);
                                    }
                                    else {
                                        image.w = width;
                                        image.h = height;
                                    }
                                } else {
                                    if (height >= 800) {
                                        image.h = 800;
                                        image.w = Math.round((800 / height) * width);
                                    } else {
                                        image.w = width;
                                        image.h = height;
                                    }
                                }
                            } else {
                                image.w = width;
                                image.h = height;
                            }

                        }
                    };
                    xmlhttp.open("GET", url, true);
                    xmlhttp.send();
                });

                // get USER info.
                var url = URL.USERS_ID;
                if ($scope.travelogue.ownerType === 'Admin') {
                    url = URL.ADMINS_ID;
                }

                $http.get(URL.assemble(url, $scope.travelogue.ownerId)).then(function (response) {
                    $scope.travelogue.author = response.data.data;
                }, function (response) {
                    console.log(response);
                });

                $rootScope.titleText = $scope.travelogue.title;

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

                    var filteredSummary = $filter('plainText')($scope.travelogue.texts && $scope.travelogue.texts.length > 0 ? $scope.travelogue.texts[0].text : $scope.travelogue.title);
                    filteredSummary = filteredSummary.length > 200 ? filteredSummary.substring(0, 200) + '...' : filteredSummary;

                    wx.ready(function () {
                        wx.onMenuShareAppMessage({
                            title: $scope.travelogue.title, // 分享标题
                            desc: filteredSummary, // 分享描述
                            link: $location.$$absUrl, // 分享链接
                            imgUrl: $scope.travelogue.coverImg, // 分享图标
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

            loadComments(1, $scope.pagination.commentsPerPage, {});

        }

        $scope.openPhotoSwipe = function (node, event) {

            $rootScope.isPhotoSwipeShow = true;

            var pswpElement = document.querySelectorAll('.pswp')[0];

            // define options (if needed)
            var options = {
                // history & focus options are disabled on CodePen

                index: $scope.travelogue.images.indexOf(node),
                history: false,
                // focus: false,
                //
                // showAnimationDuration: 0,
                // hideAnimationDuration: 0,
                shareButtons: [
                    {id: 'download', label: '下载原图', url: '{{raw_image_url}}', download: true}
                ],
                getImageURLForShare: function (shareButtonData) {
                    // `shareButtonData` - object from shareButtons array
                    //
                    // `pswp` is the gallery instance object,
                    // you should define it by yourself
                    //
                    if (shareButtonData.id === 'download') {
                        return gallery.currItem.image || gallery.currItem.src || '';
                    }
                    // return gallery.currItem.src || '';
                },
                getThumbBoundsFn: function (index) {

                    // find thumbnail element
                    var thumbnail = document.querySelectorAll('figure')[index];

                    // get window scroll Y
                    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                    // optionally get horizontal scroll

                    // get position of element relative to viewport
                    var rect = thumbnail.getBoundingClientRect();

                    // w = width
                    return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};


                    // Good guide on how to get element coordinates:
                    // http://javascript.info/tutorial/coordinates
                }

            };

            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, $scope.travelogue.images, options);
            gallery.listen('destroy', function () {
                $rootScope.isPhotoSwipeShow = false;
            });
            gallery.init();
        };

        $scope.thumbsUp = function () {
            $http.post(URL.assemble(URL.TRAVELOGUES_THUMBS_UP, $stateParams.id)).then(function (response) {
                $scope.travelogue.thumbs = response.data.data;
                localStorage.setItem('thumb' + $scope.travelogue.id, authenticationService.getClaims().userId);
            }, function (error) {
                console.log(error);
            });
        };

        $scope.disabledThumbsUp = function () {
            return localStorage.getItem('thumb' + $scope.travelogue.id) === authenticationService.getClaims().userId;
        };

        $scope.openCommentBlock = function (comment) {
            if (comment.showCommentBlock) {
                comment.showCommentBlock = false;
            } else {
                angular.forEach($scope.travelogueComments.content, function (item) {
                    item.showCommentBlock = false;
                });
                comment.showCommentBlock = true;
            }
        };

        $scope.submitComment = function (form, isReplyToUser, repliedUserId, repliedUserType) {

            var hasError = false;
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

                var comment;
                if (repliedUserId !== undefined) {
                    comment = $scope.replyComment;
                } else {
                    comment = $scope.comment;
                }

                comment.isReplyToUser = isReplyToUser;
                if (isReplyToUser) {
                    comment.repliedUserId = repliedUserId;
                    comment.repliedUserType = repliedUserType;
                }
                comment.replyId = $stateParams.id;
                comment.replyType = 'Main';

                $http.post(URL.get(URL.TRAVELOGUES_COMMENTS), comment).then(function (response) {

                    comment.content = '';
                    form.$setPristine();
                    $scope.loadComments($scope.pagination.currentPage);
                    toastr.success('评论发表成功');
                    $scope.saving = false;

                }, function (error) {
                    console.log(error);
                    $scope.saving = false;
                    dataService.error(error);
                });
            });
        };

        $scope.hasUserOwnTravelogue = function () {
            return authenticationService.getClaims().tokenType === 'ADMIN';
        };

        $scope.deleteTravelogue = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/templates/dangerConfirm.html',
                controller: 'ConfirmDeleteCtrl',
                resolve: {
                    message: function () {
                        return '确认删除游记吗？操作不可恢复哦！';
                    }
                }
            });

            modalInstance.result.then(function () {

                var url = URL.TRAVELOGUES_USER_DELETE;
                if (authenticationService.isAdmin()) {
                    url = URL.TRAVELOGUES_ID;
                }

                $http.delete(URL.assemble(url, $stateParams.id)).then(function (response) {
                    toastr.success('游记已删除');
                    $state.go('home', {tab: 'travelogues'});
                }, function (error) {
                    dataService.error(error);
                    console.log(error);
                });
            });

        };

        var query = {sorts: [{direction: 0, field: 'weight'}]};
        var loadActivities = function (pageNum, pageSize, query) {
            var deferred = $q.defer();
            $http.post(URL.assemble(URL.ACTIVITIES_QUERY, pageNum, pageSize), query).then(function (response) {
                $scope.activity = response.data.data.content[0];

                deferred.resolve();
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        loadActivities(1, 1, query);

    }

})();
