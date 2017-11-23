import angular from 'angular';
import uiRouter from 'angular-ui-router';
import archiveComponent from './archive.component';

const archiveModule = angular.module('archive', [
  uiRouter,
])

  .config(($stateProvider) => {
    'ngInject';

    $stateProvider
      .state('index.archive', {
        url: '/archive',
        resolve: {
          archive: (ApiService) => {
            'ngInject';

            return ApiService.entitySearchOne({
              q: 'schema:archive',
              children: 1,
            }).then((archive) => {
              return archive.fields.assets;
            });
          },
        },
        views: {
          content: {
            template: '<archive></archive>',
          }
        }
      });

    $stateProvider
      .state('index.archive.profile', {
        url: '/information',
        views: {
          'overlay@index': {
            template: '<profile></profile>',
          },
        },
        data: {
          'gsapifyRouter.overlay': {
            enter: {
              in: {
                transition: 'fadeUpDelayed',
              }
            }
          }
        },
      });

  })

  .directive('archive', archiveComponent);

export default archiveModule;
