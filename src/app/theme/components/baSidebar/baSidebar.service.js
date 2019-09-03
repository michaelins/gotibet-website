(function() {
  'use strict';

  angular.module('GoTibetWebsite.theme.components')
      .provider('baSidebarService', baSidebarServiceProvider);

  /** @ngInject */
  function baSidebarServiceProvider() {
    var staticMenuItems = [];

    this.addStaticItem = function() {
      staticMenuItems.push.apply(staticMenuItems, arguments);
    };

    /** @ngInject */
    this.$get = function($state,layoutSizes, authenticationService) {
      return new _factory();

      function _factory() {
        var isMenuCollapsed = shouldMenuBeCollapsed();

        this.getMenuItems = function() {

          var permissions = authenticationService.getClaims().permissions;

          var states = defineMenuItemStates();
          var menuItems = states.filter(function(item) {
            return item.level == 0;
          });

          menuItems.forEach(function(item) {
            var children = states.filter(function(child) {
              var restricted = permissions.filter(function (permission) {
                return permission === child.name;
              }).length == 0;
              if(restricted) {
                // var allStates = registry.get();
              }
              return child.level > 0 && child.name.indexOf(item.name) === 0 && !restricted;
            });
            item.subMenu = children.length ? children : null;
          });

          menuItems = menuItems.filter(function(item) {
            var abs = !(item.abstract===true)
            var sub = item.subMenu != null;
            return abs || sub;
          });





          return menuItems.concat(staticMenuItems);
        };

        this.shouldMenuBeCollapsed = shouldMenuBeCollapsed;
        this.canSidebarBeHidden = canSidebarBeHidden;

        this.setMenuCollapsed = function(isCollapsed) {
          isMenuCollapsed = isCollapsed;
        };

        this.isMenuCollapsed = function() {
          return isMenuCollapsed;
        };

        this.toggleMenuCollapsed = function() {
          isMenuCollapsed = !isMenuCollapsed;
        };

        this.getAllStateRefsRecursive = function(item) {
          var result = [];
          _iterateSubItems(item);
          return result;

          function _iterateSubItems(currentItem) {
            currentItem.subMenu && currentItem.subMenu.forEach(function(subItem) {
              subItem.stateRef && result.push(subItem.stateRef);
              _iterateSubItems(subItem);
            });
          }
        };

        function defineMenuItemStates() {
          return $state.get()
              .filter(function(s) {
                return s.sidebarMeta;
              })
              .map(function(s) {
                var meta = s.sidebarMeta;
                return {
                  name: s.name,
                  title: s.title,
                  level: (s.name.match(/\./g) || []).length,
                  order: meta.order,
                  icon: meta.icon,
                  stateRef: s.name,
                  abstract: s.abstract
                };
              })
              .sort(function(a, b) {
                return (a.level - b.level) * 100 + a.order - b.order;
              });
        }

        function shouldMenuBeCollapsed() {
          return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
        }

        function canSidebarBeHidden() {
          return window.innerWidth <= layoutSizes.resWidthHideSidebar;
        }
      }

    };

  }
})();
