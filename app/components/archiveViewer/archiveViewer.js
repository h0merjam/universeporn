import angular from 'angular';
import uiRouter from 'angular-ui-router';
import archiveViewerComponent from './archiveViewer.component';

const archiveViewerModule = angular.module('archiveViewer', [
  uiRouter,
])

  .config(($stateProvider) => {
    'ngInject';

    $stateProvider
      .state('index.archive.viewer', {
        url: '/{index:[0-9]{1,5}}',
        views: {
          'overlay@index': {
            template: '<archive-viewer></archive-viewer>',
          },
        },
        data: {
          'gsapifyRouter.overlay': {
            enter: {
              in: {
                transition: ($state, $stateParams) => {
                  'ngInject';

                  const prevState = $state.history[$state.history.length - 1];

                  if (prevState.name !== 'index.archive.viewer') {
                    return 'fadeUpDelayed';
                  }

                  return 'none';

                  // if (parseInt($stateParams.index, 10) < parseInt(prevState.params.index, 10)) {
                  //   return 'slideLeft';
                  // } else {
                  //   return 'slideRight';
                  // }
                },
              },
            },
            leave: {
              out: {
                transition: ($state, $stateParams) => {
                  'ngInject';

                  const prevState = $state.history[$state.history.length - 1];

                  if ($state.current.name !== 'index.archive.viewer') {
                    return 'fadeNoDelay';
                  }

                  return 'none';

                  // if (parseInt($stateParams.index, 10) > parseInt(prevState.params.index, 10)) {
                  //   return 'slideLeft';
                  // } else {
                  //   return 'slideRight';
                  // }
                },
              },
            },
          },
        },
      });

  })

  .directive('archiveViewer', archiveViewerComponent);

export default archiveViewerModule;
