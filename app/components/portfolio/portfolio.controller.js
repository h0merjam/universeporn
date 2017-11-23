class PortfolioController {
  /* @ngInject */
  constructor ($rootScope, $state, $document, $window, HelperService) {
    let vm = this;

    let locals = $state.$current.locals.globals;

    // $rootScope.pageTitle = '';
    // $rootScope.pageDescription = ''

    vm.assets = locals.portfolio.fields.assets;

    vm.getImageSrc = (asset) => {
      if (!asset) {
        return '';
      }

      if (asset.thumbnail.ratio >= 1) {
        return HelperService.thumbnailSrc(asset.thumbnail, 'w:960;h:720;g:Center;q:80');
      }

      return HelperService.thumbnailSrc(asset.thumbnail, 'w:960;h:1440;g:Center;q:80');
    };

    vm.getImageSrcset = (asset) => {
      if (!asset) {
        return '';
      }

      let sources = [];
      if (asset.thumbnail.ratio >= 1) {
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:540;h:405;g:Center;q:80')} 540w`);
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:960;h:720;g:Center;q:80')} 960w`);
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:1280;h:960;g:Center;q:80')} 1280w`);
      } else {
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:540;h:810;g:Center;q:80')} 540w`);
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:960;h:1440;g:Center;q:80')} 960w`);
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:1280;h:1920;g:Center;q:80')} 1280w`);
      }
      return sources.join(', ');
    };

    let docHeight = () => {
      let doc = $document[0];
      return Math.max(
        doc.body.scrollHeight, doc.documentElement.scrollHeight,
        doc.body.offsetHeight, doc.documentElement.offsetHeight,
        doc.body.clientHeight, doc.documentElement.clientHeight
      );
    };

    vm.clickScrollPrompt = (event) => {
      if ($window.scrollY + $window.innerHeight > docHeight() - 300) {
        $document.scrollTo(0, 0, 1600);
      } else {
        $document.scrollTo(0, $window.scrollY + $window.innerHeight, 800);
      }
    };

    vm.scrollMonitorCallback = function (watcher, asset) {
      if (!asset) {
        return;
      }

      if (watcher.isInViewport) {
        asset.$show = true;
      }
    };
  }
}

export default PortfolioController;
