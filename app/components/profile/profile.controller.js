class ProfileController {
  /* @ngInject */
  constructor($rootScope, $state) {
    const vm = this;

    const locals = $state.$current.locals.globals;

    // $rootScope.pageTitle = '';
    // $rootScope.pageDescription = '';

    vm.profile = locals.profile;
  }
}

export default ProfileController;
