class ProfileController {
  /* @ngInject */
  constructor($rootScope, $state) {
    let vm = this;

    let locals = $state.$current.locals.globals;

    // $rootScope.pageTitle = '';
    // $rootScope.pageDescription = '';

    vm.profile = locals.profile;
  }
}

export default ProfileController;
