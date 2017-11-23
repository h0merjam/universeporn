import angular from 'angular';
// import OpenSeadragon from 'script-loader!openseadragon/build/openseadragon/openseadragon';
import OpenSeadragon from 'script-loader!./openseadragon';

let openSeadragon = window.OpenSeadragon;

export default angular.module('hj.openSeadragon', [])
  .directive('hjOpenSeadragon', ['$window', '$document',
    function ($window, $document) {
      return {
        restrict: 'AE',
        scope: {
          tileSources: '=',
          options: '=?',
        },
        link: function ($scope, $element, $attrs) {
          var defaults = {
            element: $element[0],
            tileSources: $scope.tileSources,
            prefixUrl: '',
          };

          var options = angular.extend(defaults, $scope.options);

          var init = function () {
            var viewer = openSeadragon(options);

            var events = ['open', 'tile-loaded', 'tile-drawn'];

            events.forEach(function (event) {
              viewer.addHandler(event, function (obj) {
                $scope.$emit('hjOpenSeadragon:' + event, obj);
              });
            });
          };

          $scope.$watch('tileSources', tileSources => {
            if (tileSources) {
              options.tileSources = tileSources;

              init();
            }
          });
        },
      };
    }]);
