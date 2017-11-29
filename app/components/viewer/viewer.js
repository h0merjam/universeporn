import angular from 'angular';
import uiRouter from 'angular-ui-router';
import viewerComponent from './viewer.component';

const viewerModule = angular.module('viewer', [
  uiRouter,
])

  .config(($stateProvider) => {
    'ngInject';

    $stateProvider
      .state('index.viewer', {
        url: '/observations/{index:[0-9]{1,4}}?zoom',
        views: {
          overlay: {
            template: '<menu></menu>',
          },
          content: {
            template: '<viewer></viewer>',
          },
        },
      });

    $stateProvider
      .state('index.viewer.profile', {
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

  .directive('viewer', viewerComponent);

export default viewerModule;
