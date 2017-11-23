class ArchiveController {
  /* @ngInject */
  constructor($rootScope, $state, HelperService) {
    let vm = this;

    let locals = $state.$current.locals.globals;

    $rootScope.pageTitle = 'Archive';
    // $rootScope.pageDescription = '';

    vm.assets = HelperService.group(locals.archive);
  }
}

export default ArchiveController;
