import angular from 'angular';
import uiRouter from 'angular-ui-router';
import menuComponent from './menu.component';

let menuModule = angular.module('menu', [
  uiRouter,
])

  .config(() => {
    'ngInject';
  })

  .directive('menu', menuComponent);

export default menuModule;
