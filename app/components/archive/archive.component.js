import template from './archive.html';
import controller from './archive.controller';
import './archive.scss';

const archiveComponent = function archiveComponent() {
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

export default archiveComponent;
