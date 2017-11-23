import angular from 'angular';
import _ from 'lodash';
import vimeoStyles from '!!raw-loader!sass-loader!./vimeo.scss';

class ArchiveViewerController {
  /* @ngInject */
  constructor ($rootScope, $scope, $state, $stateParams, HelperService) {
    let vm = this;

    let locals = $state.$current.locals.globals;

    // $rootScope.pageTitle = ''
    // $rootScope.pageDescription = ''

    let archive = HelperService.group(locals.archive);

    let currentIndex = parseInt($stateParams.index, 10);

    vm.nextIndex = currentIndex === archive.length - 1 ? 0 : currentIndex + 1;
    vm.prevIndex = currentIndex === 0 ? archive.length - 1 : currentIndex - 1;

    vm.assets = archive[$stateParams.index];

    let caption = vm.assets.entities
      .map(asset => asset.fields.description)
      .filter(caption => caption && caption !== '');

    vm.caption = _.uniq(caption).join(' / ');

    $rootScope.viewer = vm.assets.entities[0].schema;

    let stateChangeStart = $scope.$on('$stateChangeStart', (event, toState) => {
      stateChangeStart();

      $rootScope.viewer = null;
    });

    vm.getImageSrc = asset => HelperService.thumbnailSrc(asset.thumbnail, 'w:960;q:80');

    vm.getImageSrcset = (asset) => {
      let sources = [];

      sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:540;q:80')} 540w`);
      sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:960;q:80')} 960w`);
      sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:1280;q:80')} 1280w`);

      return sources.join(', ');
    };

    vm.close = () => {
      $state.go('index.archive');
    };

    vm.next = () => {
      $state.go('index.archive.viewer', { index: vm.nextIndex });
    };

    vm.prev = () => {
      $state.go('index.archive.viewer', { index: vm.prevIndex });
    };

    vm.clickImage = (event) => {
      event.stopPropagation();
      event.preventDefault();

      if ($scope.$cursorRight || !$scope.$cursorLeft) {
        vm.next();
      } else {
        vm.prev();
      }
    };

    let isTouch = Modernizr.touch;
    let playerReady = false;

    $scope.$on('vimeoApi:ready', (event, player) => {
      let iframe = angular.element(player.element);
      // let body = iframe.contents().find('body')

      // body.append('<style type="text/css">' + vimeoStyles + '</style>')

      if (isTouch) {
        iframe.addClass('ready');
      } else {
        player.addEvent('playProgress', () => {
          if (!playerReady) {
            playerReady = true;
            iframe.addClass('ready');
          }
        });
      }

      player.addEvent('finish', () => {
        player.api('play');
      });
    });
  }
}

export default ArchiveViewerController;
