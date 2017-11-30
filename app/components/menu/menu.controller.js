import fscreen from 'fscreen';

class MenuController {
  /* @ngInject */
  constructor($scope, $document) {
    const vm = this;

    vm.fullscreenEnabled = fscreen.fullscreenEnabled;

    vm.isFullScreen = false;

    fscreen.addEventListener('fullscreenchange', () => {
      $scope.$apply(() => {
        vm.isFullScreen = fscreen.fullscreenElement;
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
