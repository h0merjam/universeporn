import angular from 'angular';
import uiRouter from 'angular-ui-router';
import notFoundComponent from './notFound.component';

const notFoundModule = angular.module('notFound', [
  uiRouter,
])

  .config(($stateProvider) => {
    'ngInject';

    $stateProvider
      .state('notFound', {
        url: '/404',
        views: {
          app: {
            template: '<not-found></not-found>',
          },
        },
      });
  })

  .directive('notFound', notFoundComponent);

export default notFoundModule;
