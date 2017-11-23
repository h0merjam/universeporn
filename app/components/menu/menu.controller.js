class MenuController {
  /* @ngInject */
  constructor($scope, $document, $element, $timeout) {
    let vm = this;

    vm.hidden = false;

    let hideTimeout;

    let resetHidden = () => {
      $timeout(() => {
        vm.hidden = false;
      });

      $timeout.cancel(hideTimeout);

      hideTimeout = $timeout(() => {
        vm.hidden = true;
      }, 5000);
    };

    $document.on('mousemove', resetHidden);
    $document.on('keypress', resetHidden);

    $scope.$on('$destroy', () => {
      $document.off('mousemove', resetHidden);
      $document.off('keypress', resetHidden);
    });
  }
}

export default MenuController;
