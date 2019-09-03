/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('GoTibetWebsite.theme.components')
      .directive('pageFooter', pageFooter);

  /** @ngInject */
  function pageFooter() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageFooter/pageFooter.html',
        controller: 'pageFooterCtrl'
    };
  }

})();