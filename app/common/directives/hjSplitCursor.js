import angular from 'angular';

export default angular.module('hj.splitCursor', [])
  .directive('hjSplitCursor', () => {
    return {
      restrict: 'A',
      link: ($scope, $element, $attrs) => {
        let defaults = {
          left: 0.5,
          right: 0.5,
          top: 0.5,
          bottom: 0.5,
          leftClass: 'cursor--left',
          rightClass: 'cursor--right',
          topClass: 'cursor--top',
          bottomClass: 'cursor--bottom',
        };

        let options = angular.extend(defaults, $scope.$eval($attrs.hjSplitCursor) || {});

        let x;
        let y;

        let findPosition = (event) => {
          // event.stopPropagation();

          if (event.pageX <= event.view.innerWidth * options.left) {
            $scope.$cursorLeft = true;
            $scope.$cursorRight = false;

            if (x !== options.leftClass) {
              $element.removeClass(options.rightClass);
              $element.addClass(options.leftClass);

              $scope.$apply();
            }

            x = options.leftClass;

          } else if (event.pageX >= event.view.innerWidth * (1 - options.right)) {
            $scope.$cursorRight = true;
            $scope.$cursorLeft = false;

            if (x !== options.rightClass) {
              $element.removeClass(options.leftClass);
              $element.addClass(options.rightClass);

              $scope.$apply();
            }

            x = options.rightClass;

          } else {
            $scope.$cursorRight = false;
            $scope.$cursorLeft = false;

            if (x !== false) {
              $element.removeClass(options.leftClass);
              $element.removeClass(options.rightClass);

              $scope.$apply();
            }

            x = false;
          }

        };

        $element.on('mouseenter', findPosition);
        $element.on('mousemove', findPosition);

      }
    };
  });
