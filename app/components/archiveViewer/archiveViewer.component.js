import template from './archiveViewer.html';
import controller from './archiveViewer.controller';
import './archiveViewer.scss';

const archiveViewerComponent = function archiveViewerComponent() {
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

export default archiveViewerComponent;
