import template from './app.html';
import './app.scss';

let appComponent = () => {
  return {
    template,
    restrict: 'E',
  };
};

export default appComponent;

