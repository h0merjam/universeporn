import angular from 'angular';

export default angular.module('hj.splitCursor', [])
  .directive('hjSplitCursor', () => ({
    restrict: 'A',
    link: ($scope, $element, $attrs) => {
      const defaults = {
        left: 0.5,
        right: 0.5,
        top: 0.5,
        bottom: 0.5,
        leftClass: 'cursor--left',
        rightClass: 'cursor--right',
        topClass: 'cursor--top',
        bottomClass: 'cursor--bottom',
      };

      const options = angular.extend(defaults, $scope.$eval($attrs.hjSplitCursor) || {});

      let x;
      let y;

      const findPosition = (event) => {
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

        if (event.pageY <= event.view.innerHeight * options.top) {
          $scope.$cursorTop = true;
          $scope.$cursorBottom = false;

          if (y !== options.topClass) {
            $element.removeClass(options.bottomClass);
            $element.addClass(options.topClass);

            $scope.$apply();
          }

          y = options.topClass;

        } else if (event.pageY >= event.view.innerHeight * (1 - options.bottom)) {
          $scope.$cursorBottom = true;
          $scope.$cursorTop = false;

          if (y !== options.bottomClass) {
            $element.removeClass(options.topClass);
            $element.addClass(options.bottomClass);

            $scope.$apply();
          }

          y = options.bottomClass;

        } else {
          $scope.$cursorBottom = false;
          $scope.$cursorTop = false;

          if (y !== false) {
            $element.removeClass(options.topClass);
            $element.removeClass(options.bottomClass);

            $scope.$apply();
          }

          y = false;
        }
      };

      $element.on('mouseenter', findPosition);
      $element.on('mousemove', findPosition);

    },
  }));
