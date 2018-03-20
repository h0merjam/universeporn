import _ from 'lodash';
import angular from 'angular';
// import vimeoStyles from '!!raw-loader!sass-loader!./vimeo.scss';

class ViewerController {
  /* @ngInject */
  constructor($rootScope, $scope, $state, $stateParams, $window, $document, $timeout, HelperService) {
    const vm = this;

    const locals = $state.$current.locals.globals;

    const isHome = $state.current.name === 'index.home';

    const hero = locals.portfolio.fields.hero;
    const portfolio = locals.portfolio.fields.assets;

    const index = $stateParams.index !== undefined ? parseInt($stateParams.index, 10) - 1 : 0;
    const nextIndex = index === portfolio.length - 1 ? 0 : index + 1;
    const prevIndex = index === 0 ? portfolio.length - 1 : index - 1;

    vm.demo = !!$stateParams.demo;

    if (isHome) {
      if ($stateParams.hero) {
        vm.asset = hero[parseInt($stateParams.hero, 10)];
      } else {
        vm.asset = _.sample(hero) || portfolio[index];
      }

    } else {
      vm.asset = portfolio[index];
    }

    if (!isHome) {
      $rootScope.pageTitle = vm.asset.title;
    // $rootScope.pageDescription = '';
    }

    let socialImage = HelperService.thumbnailSrc(vm.asset.thumbnail, 'w:1280;h:960;q:80');

    if (!/https?:\/\//.test(socialImage)) {
      socialImage = `${$window.location.protocol}//${$window.location.host}${socialImage}`;
    }

    $rootScope.ogImage = socialImage;
    $rootScope.twitterImage = socialImage;

    $scope.$on('$stateChangeSuccess', (event, toState) => {
      vm.wheelEnabled = !/profile/.test(toState.name);
    });

    $rootScope.viewerSchema = vm.asset.schema;

    const stateChangeStart = $scope.$on('$stateChangeStart', (event, toState) => {
      stateChangeStart();

      $rootScope.$broadcast('hjShine:stop');

      if (!/profile/.test(toState.name)) {
        $document.off('mousewheel');
        $document.off('DOMMouseScroll');
      }

      if (toState.name !== 'index.viewer') {
        $timeout(() => {
          $rootScope.viewerSchema = null;
        }, 400);
      }
    });

    // console.log(vm.asset);

    $rootScope.$broadcast('hjShine:spin');

    const isTouch = $window.Modernizr.touch;

    vm.showUI = false;

    if ($state.history.length === 1 || $state.history[$state.history.length - 1].name === 'index.portfolio') {
      vm.showUI = true;

      $timeout(() => {
        vm.showUI = false;
      }, 3000);
    }

    vm.next = () => {
      $state.go('index.viewer', { index: nextIndex + 1, zoom: vm.zoomLevel });
    };

    vm.prev = () => {
      $state.go('index.viewer', { index: prevIndex + 1, zoom: vm.zoomLevel });
    };

    const keydownHandler = (event) => {
      // if (event.keyCode === 39 || event.keyCode === 40) {
      if (event.keyCode === 39) {
        vm.next();
      }

      // if (event.keyCode === 37 || event.keyCode === 38) {
      if (event.keyCode === 37) {
        vm.prev();
      }
    };

    if (!isHome) {
      $document.on('keyup', keydownHandler);
    }

    $scope.$on('$destroy', () => {
      $document.off('keyup', keydownHandler);
    });

    /**
     * Video
     *
     */

    if (vm.asset.schema === 'video') {
      let playerReady = false;

      $scope.$on('vimeoApi:ready', (event, player) => {
        const iframe = angular.element(player.element);
        // let body = iframe.contents().find('body');

        // body.append('<style type="text/css">' + vimeoStyles + '</style>');

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

        $rootScope.$broadcast('hjShine:stop');

        player.addEvent('finish', () => {
          player.api('play');
        });
      });
    }

    /**
     * Image (DZI)
     *
     */

    if (vm.asset.schema === 'image') {
      const initImage = () => {
        vm.dzi = [$rootScope.assistUrl, $rootScope.slug, vm.asset.fields.image.dzi.dir, vm.asset.fields.image.dzi.fileName].join('/');
      };

      vm.zoomLevel = isTouch ? 1 : $stateParams.zoom || 2;

      $scope.$on('hjCustomSeadragon:ready', () => {
        $rootScope.$broadcast('hjShine:stop');
      });

      if (vm.asset.fields.image.crops && vm.asset.fields.image.crops.focus) {
        const crop = vm.asset.fields.image.crops.focus;

        vm.focusPoint = {
          x: crop[0] + ((crop[2] - crop[0]) * 0.5),
          y: crop[1] + ((crop[3] - crop[1]) * 0.5),
        };

        initImage();

      } else {
        // HelperService.focusPoint(vm.asset)
        //   .then((point) => {
        //     vm.focusPoint = {
        //       x: point.x / point.width,
        //       y: point.y / point.height,
        //     };

        //     initImage();
        //   });

        vm.focusPoint = {
          x: 0.5,
          y: 0.5,
        };

        initImage();
      }
    }

  }
}

export default ViewerController;
