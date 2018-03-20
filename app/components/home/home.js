import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';

const homeModule = angular.module('home', [
  uiRouter,
])

  .config(($stateProvider) => {
    'ngInject';

    $stateProvider.state('index.home', {
      url: '?zoom&demo&hero',
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
      .state('index.home.profile', {
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

  .directive('home', homeComponent);

export default homeModule;
