import 'script-loader!modernizr/modernizr';
import 'script-loader!detectizr';

import * as eases from 'eases';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import angularSanitize from 'angular-sanitize';
import angularAnimate from 'angular-animate';
import angularTouch from 'angular-touch';

import * as ace from '@homerjam/ace-angular';
// import * as ace from '../../ace-angular';

import angularLoadingBar from 'angular-loading-bar';
import angularGsapifyRouter from 'angular-gsapify-router';
import angularScroll from 'angular-scroll';
import angularImagesLoaded from 'angular-images-loaded';

import 'script-loader!scrollmagic';
import 'script-loader!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import 'script-loader!scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';
import angularScrollMagic from 'angular-scroll-magic';

import viewportUnitsBuggyfillHacks from 'viewport-units-buggyfill/viewport-units-buggyfill.hacks';
import viewportUnitsBuggyfill from 'viewport-units-buggyfill';

import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';

angular.module('app', [
  uiRouter,
  angularSanitize,
  angularAnimate,
  angularTouch,

  Common.name,
  Components.name,

  ace.apiService,
  ace.errorService,
  ace.helperService,
  ace.generalFilters,

  angularLoadingBar,
  angularGsapifyRouter,
  angularScroll,
  angularImagesLoaded,
  angularScrollMagic,
])

  .constant('appConfig', window.appConfig)

  .value('duScrollOffset', 0)
  .value('duScrollEasing', eases.quintInOut)
  .value('duScrollDuration', 800)

  .directive('app', AppComponent)

  .config(($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $httpProvider, $sceDelegateProvider, $sceProvider, cfpLoadingBarProvider, gsapifyRouterProvider, scrollMagicProvider) => {
    'ngInject';

    $locationProvider.html5Mode(true);
    // $urlRouterProvider.otherwise('/404');
    $urlRouterProvider.otherwise(($injector, $location) => {
      setTimeout(() => {
        window.location.href = '/404';
      }, 5000);
    });
    $urlMatcherFactoryProvider.strictMode(false);

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://*.s3.amazonaws.com/**',
      'https://*.youtube.com/**',
      'https://*.vimeo.com/**',
      'http://*.vimeo.com/**',
      'https://*.embedly.com/**',
    ]);

    // scrollMagicProvider.addIndicators = true;

    // cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.includeSpinner = false;

    gsapifyRouterProvider.defaults = {
      enter: 'fadeDelayed',
      leave: 'fade',
    };

    gsapifyRouterProvider.transition('fade', {
      duration: 0.4,
      delay: 0.2,
      css: {
        opacity: 0,
      },
    });

    gsapifyRouterProvider.transition('fadeNoDelay', {
      duration: 0.4,
      css: {
        opacity: 0,
      },
    });

    gsapifyRouterProvider.transition('fadeDelayed', {
      duration: 0.4,
      delay: 0.8,
      css: {
        opacity: 0,
      },
    });

    gsapifyRouterProvider.transition('fadeUpDelayed', {
      duration: 0.6,
      delay: 0.4,
      css: {
        opacity: 0,
        y: 20,
      },
    });

    gsapifyRouterProvider.transition('slideLeft', {
      duration: 0.6,
      css: {
        x: '-100%',
      },
    });

    gsapifyRouterProvider.transition('slideRight', {
      duration: 0.6,
      css: {
        x: '100%',
      },
    });

    $stateProvider.state('index', {
      abstract: true,
      resolve: {
        metadata: ($rootScope, ApiService) => {
          'ngInject';

          return ApiService.metadata()
            .then((metadata) => {
              $rootScope.metadata = metadata;
              $rootScope.pageDescription = metadata.description;
              return metadata;
            });
        },
        profile: ApiService => ApiService.entitySearchOne({
          q: 'schema:profile',
          include_docs: true,
        }).then(profile => profile.fields.text),
        portfolio: ApiService => ApiService.entitySearchOne({
          q: 'schema:portfolio',
          children: 1,
        }),
      },
      views: {
        app: {},
      },
      data: {
        'gsapifyRouter.overlay': {
          leave: {
            out: {
              transition: 'fadeNoDelay',
              priority: 99,
            },
          },
        },
      },
    });

  })

  .run(($rootScope, $state, $location, $window, $document, $timeout, $log, $injector, $q, HelperService, appConfig) => {
    'ngInject';

    // Disable pinch zoom (except in Safari)
    // $document.on('mousewheel', function (event) {
    //   if (event.ctrlKey) {
    //     event.preventDefault();
    //   }
    // });

    viewportUnitsBuggyfill.init({
      hacks: viewportUnitsBuggyfillHacks,
      // force: true,
    });

    $rootScope.slug = appConfig.slug;
    $rootScope.assistUrl = appConfig.assistUrl;

    $rootScope.$state = $state;
    $rootScope.$location = $location;

    $rootScope.$isDesktop = $window.Detectizr.device.type === 'desktop';
    $rootScope.$isMobile = $window.Detectizr.device.type === 'mobile';
    $rootScope.$isTablet = $window.Detectizr.device.type === 'tablet';

    $rootScope.now = new Date();

    // Error catching

    $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
      $log.error(error);

      if (toState.name !== 'notFound') {
        // $state.go('notFound');
        $window.location.href = '/404';
      }
    });

    // Google Analytics

    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
      if (typeof ga !== 'undefined') {
        ga('send', 'pageview', {
          page: $location.path(),
        });
      }
    });

    // Force repaint to correct page height

    // $rootScope.$on('gsapifyRouter:enterSuccess', function (event, element) {
    //   let view = element.attr('ui-view');

    //   if (view === 'content') {
    //     let el = $document[0].body;
    //     let display = el.style.display;
    //     el.style.display = 'none';
    //     let trick = el.offsetHeight;
    //     el.style.display = display;

    //     $timeout(() => {
    //       element.addClass('enter-success');
    //     });
    //   }
    // });

    // Loading

    $rootScope.$on('cfpLoadingBar:started', () => {
      $rootScope.loading = true;
    });

    $rootScope.$on('cfpLoadingBar:completed', () => {
      $rootScope.loading = false;
    });

    // Scroll position

    let scrollMap = {};
    let currentStateKey;

    let getCurrentStateKey = () => {
      let currentState = {
        name: $state.current.name,
        params: $state.params,
      };

      return JSON.stringify(currentState);
    };

    angular.element($window).on('scroll', () => {
      scrollMap[currentStateKey] = $window.scrollY;
    });

    $rootScope.$on('$stateChangeSuccess', () => {
      currentStateKey = getCurrentStateKey();
    });

    $rootScope.$on('gsapifyRouter:leaveSuccess', (event, element) => {
      if ($state.history[$state.history.length - 1].name.indexOf($state.current.name) !== -1) {
        return;
      }

      let prevState = $state.history[$state.history.length - 2];

      if (prevState) {
        let prevStateKey = JSON.stringify(prevState);

        if (currentStateKey === prevStateKey) {
          $document.scrollTo(0, scrollMap[prevStateKey]);
          return;
        }
      }

      let view = element.attr('ui-view');

      if (view === 'content') {
        $timeout(() => {
          $document.scrollTo(0, 0);
        });
      }
    });

    // Favicon

    let faviconEl = $document[0].querySelector('link[rel*="icon"]');

    let favicons = ['/img/eye1.ico', '/img/eye2.ico'];

    // let favicons = [
    //   '/img/favicon/k.ico',
    //   '/img/favicon/a.ico',
    //   '/img/favicon/r.ico',
    //   '/img/favicon/i.ico',
    //   '/img/favicon/n.ico',
    //   '/img/favicon/a.ico',
    //   '/img/favicon/t.ico',
    //   '/img/favicon/w.ico',
    //   '/img/favicon/i.ico',
    //   '/img/favicon/s.ico',
    //   '/img/favicon/s.ico',
    //   '/img/eye1.ico',
    //   '/img/eye2.ico',
    //   '/img/eye1.ico',
    // ];

    let faviconCounter = 0;
    let faviconRepeatCounter = 0;

    let toggleFavicon = () => {
      faviconEl.setAttribute('href', favicons[faviconCounter]);

      faviconCounter = faviconCounter === favicons.length - 1 ? 0 : faviconCounter + 1;

      if (faviconRepeatCounter === 2) {
        faviconEl.setAttribute('href', '/img/favicon.ico');
        faviconRepeatCounter = 0;

        $timeout(toggleFavicon, 15000);

      } else {
        if (faviconCounter === 0) {
          faviconRepeatCounter++;
        }

        $timeout(toggleFavicon, 500);
      }
    };

    // $timeout(toggleFavicon, 15000);

  });
