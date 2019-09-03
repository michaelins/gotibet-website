(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .factory('URL', URL);

    /** @ngInject */
    function URL($filter) {

        var url = {};

        url.get = function (data) {
            return url.service_url + data;
        };

        url.assemble = function () {
            if (arguments.length == 0) {
                return;
            }
            arguments[0] = url.get(arguments[0]);
            var args = Array.prototype.slice.call(arguments, 1);
            return $filter('stringular').apply(this, [].slice.call(arguments));
            // return $filter('stringular')(url.get(arguments[0]), args);
        };

        // url.SERVER_ADDRESS = 'http://dpm.fengbaogu.com:5555/core/';
        url.SERVER_ADDRESS = 'https://api.qzang.cc/core/';


        url.service_url = url.SERVER_ADDRESS;

        url.USERS = 'users';
        url.CHECK_CODE = 'checkCodes/{0}';
        url.REGISTER = 'users/mobile/password/code/{0}';
        url.LOGIN_MOBILE = 'users/mobile/password';
        url.FORGET_PASSWORD = 'users/mobile/resetPassword/code/{0}';
        url.BIND_MOBILE = 'users/mobile/password/code/{0}';
        url.TEMP_IMAGE_UPLOAD = 'files/temporary/image';
        url.USER_REG_OR_LOGIN = 'users/{0}/{1}';

        url.TRAVELOGUE_KEYWORD = 'travelogues/keyWords/content/{0}';
        url.TRAVELOGUES = 'travelogues';
        url.TRAVELOGUES_ID = 'travelogues/{0}';
        url.TRAVELOGUES_QUERY = 'travelogues/{0}/{1}';
        url.TRAVELOGUES_KEYWORDS = 'travelogues/keyWords/{0}/{1}';
        url.TRAVELOGUES_THUMBS_UP = 'travelogues/{0}/thumbs';
        url.TRAVELOGUES_USER_UPDATE = 'travelogues/ownerType/User';
        url.TRAVELOGUES_USER_DELETE = 'travelogues/{0}/ownerType/User';
        url.TRAVELOGUES_COMMENTS = 'travelogues/comments';
        url.TRAVELOGUES_COMMENTS_QUERY = 'travelogues/{0}/comments/{1}/{2}';

        url.ARTICLE_KEYWORD = 'informations/keyWords/content/{0}';
        url.ARTICLES = 'informations';
        url.ARTICLES_ID = 'informations/{0}';
        url.ARTICLES_QUERY = 'informations/{0}/{1}';
        url.ARTICLES_KEYWORDS = 'informations/keyWords/{0}/{1}';
        url.ARTICLES_THUMBS_UP = 'informations/{0}/thumbs';
        url.ARTICLES_COMMENTS = 'informations/comments';
        url.ARTICLES_COMMENTS_QUERY = 'informations/{0}/comments/{1}/{2}';

        url.ACTIVITIES = 'activities';
        url.ACTIVITIES_ID = 'activities/{0}';
        url.ACTIVITY_APPLICATION_AMOUNT = 'activities/{0}/applications/amountPits';
        url.ACTIVITIES_QUERY = 'activities/{0}/{1}';
        url.ACTIVITY_ORDERS = 'activities/applications/owner/{0}/{1}';
        url.ACTIVITY_WECHAT_BOOKING = 'activities/applicationCostType/Pay/applications/payType/WeChatPayInPublic/openid/{0}';
        url.ACTIVITY_WECHAT_WEB_BOOKING = 'activities/applicationCostType/Pay/applications/payType/WeChatPayInWeb';
        url.ACTIVITY_PAYINFO = 'activities/applications/{0}/payinfos/payType/{1}';
        url.ACTIVITY_PAYINFO_FROM_ORDER = 'activities/applications/payInfo';
        url.ACTIVITY_PAYINFO_FROM_ORDER_ALIPAY = 'activities/applications/payInfo/alipay';
        url.ACTIVITY_REFUND_APPLY = 'activities/applications/{0}/refunds';
        url.ACTIVITY_APPLICATIONS = 'activities/applications';

        url.USERS_ID = 'users/{0}';
        url.USERS_AVATAR = 'users/avatar';
        url.USERS_NEW_TOKEN = 'users/newToken';
        url.USERS_INFO = 'users/baseInfo';
        url.ADMIN_LOGIN = 'admins/username/password';
        url.ADMINS_ID = 'admins/{0}';

        url.WECHAT_SECRET_FOR_OPENID = 'we/secrets/{0}';
        url.WECHAT_LOGIN = 'http://wx.qzang.cc/wePublic/temporary/login';
        url.WECHAT_JSSDK = 'we/jssdk';

        return url;
    }

})();