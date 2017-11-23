import template from './portfolio.html';
import controller from './portfolio.controller';
import './portfolio.scss';

const portfolioComponent = function portfolioComponent() {
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

export default portfolioComponent;
