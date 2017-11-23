import angular from 'angular';
import scrollMonitor from 'scrollmonitor';

export default angular.module('hj.scrollMonitor', [])
  .directive('scrollMonitor', function scrollMonitorDirective () {
    return {
      restrict: 'EA',
      scope: {
        offsets: '=scrollMonitorOffsets',
        callback: '&scrollMonitorCallback',
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: ['$scope', '$element', '$timeout',
        function ($scope, $element, $timeout) {
          'ngInject';

          var vm = this;

          var watcher = scrollMonitor.create($element[0], vm.offsets);

          watcher.stateChange(function () {
            var locals = {
              $watcher: watcher,
            };
            $scope.$apply(function () {
              vm.callback(locals);
            });
          });

          $timeout(() => {
            watcher.recalculateLocation();
            watcher.update();

            var locals = {
              $watcher: watcher,
            };
            $scope.$apply(function () {
              vm.callback(locals);
            });
          });

          vm.$onDestroy = function () {
            watcher.destroy();
          };
        }],
    };
  });
