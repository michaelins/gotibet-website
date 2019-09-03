/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('GoTibetWebsite.pages.profile')
      .directive('profileMenu', profileMenu);

  /** @ngInject */
  function profileMenu() {
    return {
      restrict: 'E',
      // controller: 'BlurFeedCtrl',
      templateUrl: 'app/pages/profile/menu.html'
    };
  }
})();