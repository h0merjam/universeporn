import angular from 'angular';
import uiRouter from 'angular-ui-router';
import angularColumnify from 'angular-columnify';
import portfolioComponent from './portfolio.component';

const portfolioModule = angular.module('portfolio', [
  uiRouter,
  angularColumnify,
])

  .config(($stateProvider) => {
    'ngInject';

    $stateProvider
      .state('index.portfolio', {
        url: '/observations',
        views: {
          overlay: {
            template: '<menu></menu>',
          },
          content: {
            template: '<portfolio></portfolio>',
          },
        },
        data: {
          'gsapifyRouter.content': {
            enter: {
              in: {
                trigger: 'hjColumnify:init',
              },
            },
          },
        },
      });

    $stateProvider
      .state('index.portfolio.profile', {
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
          },
        },
      });

  })

  .directive('portfolio', portfolioComponent);

export default portfolioModule;
