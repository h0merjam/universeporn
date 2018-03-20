import fscreen from 'fscreen';

class MenuController {
  /* @ngInject */
  constructor($scope, $document, $stateParams) {
    const vm = this;

    vm.demo = !!$stateParams.demo;

    vm.fullscreenEnabled = fscreen.fullscreenEnabled;

    vm.isFullScreen = !!fscreen.fullscreenElement;

    fscreen.addEventListener('fullscreenchange', () => {
      $scope.$apply(() => {
        vm.isFullScreen = !!fscreen.fullscreenElement;
      });
    });

    vm.toggleFullScreen = () => {
      if (fscreen.fullscreenElement) {
        fscreen.exitFullscreen();
      } else {
        fscreen.requestFullscreen($document[0].documentElement);
      }
    };
  }
}

export default MenuController;
