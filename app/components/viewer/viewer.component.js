import template from './viewer.html';
import controller from './viewer.controller';
import './viewer.scss';

const viewerComponent = function viewerComponent() {
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

export default viewerComponent;
