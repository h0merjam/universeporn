import angular from 'angular';

export default angular.module('hj.isScrolling', [])
  .directive('hjIsScrolling', ['$window', '$timeout', ($window, $timeout) => {
    return {
      restrict: 'A',
      link: ($scope, $element, $attrs) => {

        const className = 'is-scrolling';
        const debounceMs = 300;

        let isScrolling = false;
        let scrollTimeout;

        let scrollHandler = () => {
          if (isScrolling) {
            return;
          }

          isScrolling = true;

          $element.addClass(className);

          $timeout.cancel(scrollTimeout);

          scrollTimeout = $timeout(() => {
            isScrolling = false;

            $element.removeClass(className);
          }, debounceMs);
        };

        angular.element($window).on('scroll', scrollHandler);

        $scope.$on('$destroy', () => {
          angular.element($window).off('scroll', scrollHandler);
        });

      }
    };
  }]);
