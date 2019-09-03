/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('GoTibetWebsite.theme.components')
        .directive('backTop', backTop);

    /** @ngInject */
    function backTop() {
        return {
            restrict: 'E',
            templateUrl: 'app/theme/components/backTop/backTop.html',
            controller: function ($rootScope, $scope) {
                $('#backTop').backTop({
                    'position': 768,
                    'speed': 100
                });

                $rootScope.$watch('isPhotoSwipeShow', function (newVal, oldVal) {
                    if (newVal) {
                        $('#backTop').fadeOut(100);
                    } else {
                        if ($rootScope.scroll >= 768) {
                            $('#backTop').fadeIn(100);
                        } else {
                            $('#backTop').fadeOut(100);
                        }
                    }
                });

                $scope.isQRcodeShown = -1;

                $scope.showQRcode = function (val) {
                    $scope.isQRcodeShown = val;
                };

            }
        };
    }

})();