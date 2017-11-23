import template from './menu.html';
import controller from './menu.controller';
import './menu.scss';

let menuComponent = function menuComponent() {
  'ngInject';
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true,
  };
};

export default menuComponent;
