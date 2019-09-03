'use strict';

var app = angular.module('GoTibetWebsite', [
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    // 'ui.sortable',
    'ui.router',
    // 'ngTouch',
    'toastr',
    // 'smart-table',
    // "xeditable",
    // 'ui.slimscroll',
    'daterangepicker',
    // 'angular-progress-button-styles',
    'angular-jwt',
    'angular-loading-bar',
    'angular.filter',
    'angularFileUpload',
    // 'hm.readmore',
    // 'bootstrapLightbox',
    'yaru22.angular-timeago',
    // 'frapontillo.bootstrap-switch',
    'ngImgCrop',
    'matchMedia',
    'ksSwiper',
    'mgcrea.ngStrap',
    'dragularModule',
    'uuid',
    'duScroll',
    'ui.tinymce',
    'monospaced.qrcode',
    'afkl.lazyImage',
    'GoTibetWebsite.theme',
    'GoTibetWebsite.pages'
]);

app.config(function (toastrConfig, timeAgoSettings, $uiViewScrollProvider, $locationProvider) {

    // $locationProvider.html5Mode(true);

    $uiViewScrollProvider.useAnchorScroll();

    angular.extend(toastrConfig, {
        "autoDismiss": false,
        "positionClass": "toast-top-right",
        "type": "success",
        "timeOut": "2000",
        "extendedTimeOut": "2000",
        "allowHtml": false,
        "closeButton": false,
        "tapToDismiss": true,
        "progressBar": false,
        "newestOnTop": true,
        "maxOpened": 0,
        "preventDuplicates": false,
        "preventOpenDuplicates": false
    });

    timeAgoSettings.overrideLang = 'zh_CN';

    if (!sessionStorage.length) {
        // Ask other tabs for session storage
        localStorage.setItem('getSessionStorage', Date.now());
    }

    window.addEventListener('storage', function (event) {

        if (event.key == 'getSessionStorage') {
            // Some tab asked for the sessionStorage -> send it

            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
            localStorage.removeItem('sessionStorage');

        } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
            // sessionStorage is empty -> fill it
            var data = JSON.parse(event.newValue);
            for (var key in data) {
                sessionStorage.setItem(key, data[key]);
            }
        }
    });

});


app.run(function ($rootScope, $window, $document, $anchorScroll, $timeout, $filter, screenSize, $trace, $transitions, $state, authenticationService, themeLayoutSettings, URL) {

    $rootScope.titleText = '趣西藏';

    $rootScope.$on('$stateChangeSuccess', function () {
        $window.scrollTo(0, 0)
    });

    $rootScope.isMobile = screenSize.onChange($rootScope, 'xs', function (isMatch) {
        $rootScope.isMobile = isMatch;
    });

    var windowEl = angular.element($window);
    var documentEl = angular.element($document);
    var handler = function () {
        $rootScope.scroll = windowEl.scrollTop();
        $rootScope.documentHeight = documentEl.height();
        $rootScope.windowHeight = windowEl.height();
    };
    windowEl.on('scroll', $rootScope.$apply.bind($rootScope, handler));
    handler();

    window.addEventListener('storage', function (event) {
        if (event.key == 'token') {
            var local = localStorage.getItem('token');
            if (local && null != local && 'null' != local) {
                sessionStorage.setItem('sessionToken', null);
            }
            $timeout(function () {
                if ($state.$current.name === 'auth.login') {
                    $state.go('home');
                }
                $rootScope.$digest();
            });
        }
    });

    $transitions.onBefore({}, function () {
        $anchorScroll();
    });

    // $trace.enable('TRANSITION');
    $transitions.onBefore({
        to: function (state) {
            return state.name.startsWith('profile') || state.name.startsWith('travelogue.compose')
        }
    }, function (trans) {
        if (!authenticationService.getClaims().isUser && authenticationService.getClaims().tokenType !== 'ADMIN') {
            $state.go('home');
        }
    });

    $transitions.onBefore({
        to: function (state) {
            return state.name.startsWith('article.compose') || state.name.startsWith('activity.compose');
        }
    }, function (trans) {
        if (authenticationService.getClaims().tokenType !== 'ADMIN') {
            $state.go('home');
        }
    });

    // $transitions.onBefore({
    //     to: function (state) {
    //         return state.name.startsWith('wechat.auth')
    //     }
    // }, function (trans) {
    //     if (themeLayoutSettings.isWechat) {
    //         if (!authenticationService.hasStoredToken() || !authenticationService.hasStoredOpenID()) {
    //             $window.location.href = URL.WECHAT_LOGIN;
    //         }
    //     }
    //
    // });


    $transitions.onBefore({
        to: function (state) {
            return state.name.startsWith('activity') || state.name.startsWith('wechat.order.booking');
        }
    }, function (trans) {
        if (themeLayoutSettings.isWechat) {
            if (!authenticationService.hasStoredToken() || !authenticationService.hasStoredOpenID()) {
                $window.location.href = URL.WECHAT_LOGIN;
            }
        }
    });

    // Tinymce Options

    $rootScope.tinymceOptionsFilterHTML = {
        selector: '.editable',
        inline: true,
        toolbar: false,
        menubar: false,
        plugins: ['paste'],
        paste_preprocess: function (plugin, args) {
            args.content = $filter('plainText')(args.content);
        },
        setup: function (editor) {
            editor.on('focus', function (e) {
                e.target.selection.select(e.target.getBody(), true);
                tinymce.DOM.removeClass(editor.bodyElement, 'empty');
            });

            editor.on('init', function () {
                // Default classes of tinyMCE are a bit weird
                // I add my own class on init
                // this also sets the empty class on the editor on init
                tinymce.DOM.addClass(editor.bodyElement, 'content-editor');
                if (editor.getContent() === "") {
                    tinymce.DOM.addClass(editor.bodyElement, 'empty');
                } else {
                    tinymce.DOM.removeClass(editor.bodyElement, 'empty');
                }
            });

            // You CAN do it on 'change' event, but tinyMCE sets debouncing on that event
            // so for a tiny moment you would see the placeholder text and the text you you typed in the editor
            // the selectionchange event happens a lot more and with no debouncing, so in some situations
            // you might have to go back to the change event instead.
            editor.on('blur', function () {
                if (editor.getContent() === "") {
                    tinymce.DOM.addClass(editor.bodyElement, 'empty');
                } else {
                    tinymce.DOM.removeClass(editor.bodyElement, 'empty');
                }
            });
        }
    };

    $rootScope.tinymceOptions = {
        selector: '.editable',
        inline: true,
        toolbar: false,
        menubar: false,
        plugins: ['paste'],
        setup: function (editor) {

            editor.on('focus', function (e) {
                e.target.selection.select(e.target.getBody(), true);
                tinymce.DOM.removeClass(editor.bodyElement, 'empty');
            });

            editor.on('init', function () {
                tinymce.DOM.addClass(editor.bodyElement, 'content-editor');
                if (editor.getContent() === "") {
                    tinymce.DOM.addClass(editor.bodyElement, 'empty');
                } else {
                    tinymce.DOM.removeClass(editor.bodyElement, 'empty');
                }
            });

            editor.on('blur', function () {
                if (editor.getContent() === "") {
                    tinymce.DOM.addClass(editor.bodyElement, 'empty');
                } else {
                    tinymce.DOM.removeClass(editor.bodyElement, 'empty');
                }
            });
        }
    };

    $rootScope.tinymceOptionsNoFocus = {
        inline: false,
        toolbar: false,
        menubar: false,
        statusbar: false,
        auto_focus: false,
        plugins: ['paste']
    };

    $rootScope.tinymceOptionsAutoFocus = {
        inline: false,
        toolbar: false,
        menubar: false,
        statusbar: false,
        auto_focus: true,
        plugins: ['paste']
    };

    $rootScope.datepickerOptionsSingleDate = {
        "singleDatePicker": true,
        "showDropdowns": true,
        "locale": {
            "format": "YYYY-MM-DD",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 1
        }
    };
});