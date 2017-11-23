import controller from './home.controller';
import './home.scss';

const homeComponent = function homeComponent() {
  'ngInject';

  return {
    restrict: 'E',
    scope: {},
    controller,
    controllerAs: 'vm',
    bindToController: true,
  };
};

export default homeComponent;
