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

            // return ApiService.entitySearchOne({
            //   q: 'schema:archive',
            //   children: 1,
            // }).then(archive => archive.fields.assets);

            return ApiService.entitySearch({
              q: 'schema:image',
              sort: '-sort.publishedAt<number>',
              include_docs: true,
            }).then(result => result.rows);
          },
        },
        views: {
          content: {
            template: '<archive></archive>',
          },
        },
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
              },
            },
            leave: {
              out: {
                transition: 'fadeNoDelay',
                priority: 99,
              },
            },
          },
        },
      });

  })

  .directive('archive', archiveComponent);

export default archiveModule;
