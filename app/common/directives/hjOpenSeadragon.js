/* eslint-env browser */

import angular from 'angular';
import OpenSeadragon from 'openseadragon';
// import OpenSeadragon from 'script-loader!openseadragon/build/openseadragon/openseadragon';
// import OpenSeadragon from 'script-loader!./openseadragon';

const openSeadragon = OpenSeadragon;
// const openSeadragon = window.OpenSeadragon;

export default angular.module('hj.openSeadragon', [])
  .directive('hjOpenSeadragon', () => ({
    restrict: 'AE',
    scope: {
      tileSources: '=',
      options: '=?',
    },
    link ($scope, $element) {
      const defaults = {
        element: $element[0],
        tileSources: $scope.tileSources,
        prefixUrl: '',
      };

      const options = angular.extend(defaults, $scope.options);

      function init () {
        const viewer = openSeadragon(options);

        const events = ['open', 'tile-loaded', 'tile-drawn'];

        events.forEach((event) => {
          viewer.addHandler(event, (obj) => {
            $scope.$emit(`hjOpenSeadragon:${event}`, obj);
          });
        });
      }

      $scope.$watch('tileSources', (tileSources) => {
        if (tileSources) {
          options.tileSources = tileSources;

          init();
        }
      });
    },
  }));
