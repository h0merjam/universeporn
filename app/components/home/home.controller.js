import angular from 'angular';

class HomeController {
  /* @ngInject */
  constructor($rootScope, $state) {
    const vm = this;

    const locals = $state.$current.locals.globals;

    $rootScope.pageTitle = null;
  }
}

export default HomeController;
