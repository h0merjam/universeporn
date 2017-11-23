import template from './notFound.html';
import controller from './notFound.controller';
import './notFound.scss';

const notFoundComponent = function notFoundComponent() {
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

export default notFoundComponent;
