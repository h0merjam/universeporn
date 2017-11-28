class PortfolioController {
  /* @ngInject */
  constructor ($rootScope, $state, $document, $window, HelperService) {
    const vm = this;

    const locals = $state.$current.locals.globals;

    $rootScope.pageTitle = 'Observations';
    // $rootScope.pageDescription = ''

    vm.assets = locals.portfolio.fields.assets;

    vm.getImageSrc = (asset) => {
      if (!asset) {
        return '';
      }

      if (asset.thumbnail.ratio >= 1) {
        return HelperService.thumbnailSrc(asset.thumbnail, 'w:960;h:720;q:80', 'landscape', 'center');
      }

      return HelperService.thumbnailSrc(asset.thumbnail, 'w:960;h:1440;q:80', 'portrait', 'center');
    };

    vm.getImageSrcset = (asset) => {
      if (!asset) {
        return '';
      }

      const sources = [];
      if (asset.thumbnail.ratio >= 1) {
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:540;h:405;q:80', 'landscape', 'center')} 540w`);
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:960;h:720;q:80', 'landscape', 'center')} 960w`);
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:1280;h:960;q:80', 'landscape', 'center')} 1280w`);
      } else {
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:540;h:810;q:80', 'portrait', 'center')} 540w`);
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:960;h:1440;q:80', 'portrait', 'center')} 960w`);
        sources.push(`${HelperService.thumbnailSrc(asset.thumbnail, 'w:1280;h:1920;q:80', 'portrait', 'center')} 1280w`);
      }
      return sources.join(', ');
    };

    const docHeight = () => {
      const doc = $document[0];
      return Math.max(
        doc.body.scrollHeight, doc.documentElement.scrollHeight,
        doc.body.offsetHeight, doc.documentElement.offsetHeight,
        doc.body.clientHeight, doc.documentElement.clientHeight,
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
