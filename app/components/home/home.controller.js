import angular from 'angular';

class HomeController {
  /* @ngInject */
  constructor($rootScope, $state) {
    let vm = this;

    let locals = $state.$current.locals.globals;

    $rootScope.pageTitle = null;
  }
}

export default HomeController;
