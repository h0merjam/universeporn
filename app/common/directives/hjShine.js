import angular from 'angular';
import 'script-loader!shine/dist/shine';
import 'gsap';

export default angular.module('hj.shine', [])
  .directive('hjShine', ['$window', '$timeout', ($window, $timeout) => {
    return {
      restrict: 'A',
      link: ($scope, $element, $attrs) => {
        let defaults = {
          numSteps: 8,
          opacity: 0.1,
          opacityPow: 1.2,
          offset: 0.1,
          offsetPow: 1.8,
          blur: 40,
          blurPow: 1.4,
          shadowRGB: new shinejs.Color(255, 255, 255),
          spinDuration: 2,
          spinOpacity: 0.2,
        };

        let options = angular.extend(defaults, $scope.$eval($attrs.hjShine) || {});

        let isTouch = 'ontouchstart' in $window;

        if (isTouch) {
          return;
        }

        let config = new shinejs.Config(options);

        let shine = new shinejs.Shine($element[0], config);

        let isRunning = false;
        let tween;

        let spin = () => {
          isRunning = true;

          let w = $window.innerWidth;
          let h = $window.innerHeight;

          let lightPos = {x: 0, y: 0};

          shine.config.opacity = options.spinOpacity;

          tween = TweenMax.to(lightPos, options.spinDuration, {
            bezier: [{x: 0, y: 0}, {x: w, y: 0}, {x: w, y: h}, {x: 0, y: h}, {x: 0, y: 0}],
            repeat: -1,
            delay: 1,
            ease: Power3.easeInOut,
            onUpdate: () => {
              if (shine.light) {
                shine.light.position.x = lightPos.x;
                shine.light.position.y = lightPos.y;
                shine.draw();
              }
          }});
        };

        let stop = () => {
          isRunning = false;

          tween.kill();

          shine.config.opacity = options.opacity;

          shine.draw();
        };

        let init = () => {
          shine.light.position.x = $window.innerWidth * 0.5;
          shine.light.position.y = $window.innerHeight * 0.5;

          shine.draw();
        };

        $timeout(init);

        let moveHandler = (event) => {
          if (!isRunning) {
            shine.light.position.x = event.clientX;
            shine.light.position.y = event.clientY;
            shine.draw();
          }
        };

        angular.element($window).on('mousemove', moveHandler);

        $scope.$on('$destroy', () => {
          angular.element($window).off('mousemove', moveHandler);

          shine.destroy();
        });

        $scope.$on('hjShine:spin', () => {
          $timeout(spin);
        });

        $scope.$on('hjShine:stop', stop);
      },
    };
  }]);
