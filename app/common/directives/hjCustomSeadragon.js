import angular from 'angular';

// import OpenSeadragon from 'script-loader!openseadragon/build/openseadragon/openseadragon';
import OpenSeadragon from 'script-loader!./openseadragon';
import 'script-loader!lethargy';
import 'script-loader!hamsterjs/hamster';

let openSeadragon = window.OpenSeadragon;

export default angular.module('hj.customSeadragon', [])
  .directive('hjCustomSeadragon', ['$window', '$document',
    function ($window, $document) {
      return {
        restrict: 'AE',
        scope: {
          dzi: '=',
          focusPoint: '=?',
          zoomLevel: '=?',
          disabled: '=?',
        },
        controllerAs: 'vm',
        bindToController: true,
        template: `<hj-open-seadragon
                      tile-sources="vm.dzi"
                      options="vm.openSeadragonOptions"
                      ></hj-open-seadragon>`,
        controller: ['$rootScope', '$scope', '$element', '$window', '$timeout',
          function ($rootScope, $scope, $element, $window, $timeout) {
            'ngInject';

            let vm = this;

            let isTouch = 'ontouchstart' in $window;

            let margin = 80;
            let zoomThrottle = 1000;
            let animationTime = isTouch ? 0 : 5;
            let animationTimeQuick = isTouch ? 0 : 1;
            let maxZoomModifier = 1;
            let minZoomLevel = 0;
            let isWheelZooming = false;
            let isReady = false;

            let reset;
            let zoom;
            let moveHandler;
            let wheelHandler;
            let moveHandlerFn;
            let wheelHandlerFn;
            let resetFn;
            let checkLoadedTimeout;
            let wheelTimeout;

            let openSeadragonEl = $element.children();

            vm.zoomLevel = vm.zoomLevel || 2;

            let lethargy = new Lethargy();

            vm.openSeadragonOptions = {
              constrainDuringPan: true,
              visibilityRatio: 1,
              minZoomLevel: 1,
              defaultZoomLevel: 1,
              maxZoomPixelRatio: 0.5,
              homeFillsViewer: true,
              showZoomControl: false,
              showHomeControl: false,
              showFullPageControl: false,
              animationTime: animationTime,
              panHorizontal: isTouch,
              panVertical: isTouch,
              // immediateRender: true,
              mouseNavEnabled: isTouch ? true : false,
              // gestureSettingsMouse: {
              //   scrollToZoom: false,
              //   clickToZoom: false,
              // },
              gestureSettingsTouch: {
                flickEnabled: false,
              },
            };

            let panTo = (viewer, point) => {
              let container = viewer.viewport.containerSize;
              let content = viewer.viewport.contentSize;
              let imageZoom = viewer.viewport.viewportToImageZoom(viewer.viewport.getZoom());
              let bounds = viewer.viewport.getBounds();

              let imageMinusContainerRatio = {
                x: (content.x - (container.x * (1 / imageZoom))) / content.x,
                y: (content.y - (container.y * (1 / imageZoom))) / content.x,
              };

              let newPoint = new openSeadragon.Point();

              newPoint.x = point.x * imageMinusContainerRatio.x;
              newPoint.y = point.y * imageMinusContainerRatio.y;

              newPoint.x = newPoint.x + (bounds.width * 0.5);
              newPoint.y = newPoint.y + (bounds.height * 0.5);

              viewer.viewport.panTo(newPoint);
            };

            moveHandler = (viewer, event) => {
              let container = viewer.viewport.containerSize;
              let content = viewer.viewport.contentSize;
              let imageZoom = viewer.viewport.viewportToImageZoom(viewer.viewport.getZoom());

              if (content.x * imageZoom < container.x - 1 || content.y * imageZoom < container.y - 1 || vm.zoomLevel === 0) {
                // reset(viewer);
                return;
              }

              let mouseX = event.clientX / container.x;
              let mouseY = event.clientY / container.y;

              panTo(viewer, {x: mouseX, y: mouseY});
            };

            let deltaBuffer = [120, 120, 120];

            let isDivisible = function isDivisible (n, divisor) {
              return (Math.floor(n / divisor) === n / divisor);
            };

            let isTouchpad = function (deltaY) {
              if (!deltaY) {
                return;
              }
              deltaY = Math.abs(deltaY);
              deltaBuffer.push(deltaY);
              deltaBuffer.shift();
              let allDivisable = (isDivisible(deltaBuffer[0], 120) &&
                isDivisible(deltaBuffer[1], 120) &&
                isDivisible(deltaBuffer[2], 120));
              return !allDivisable;
            };

            wheelHandler = function (viewer, event) {
              if (vm.disabled || isWheelZooming) {
                return;
              }

              event = event.originalEvent || event;

              event.preventDefault();

              if (event.deltaY === -0) {
                return;
              }

              let touchPad = isTouchpad(event.wheelDeltaY || event.wheelDelta || event.detail || 0);

              let deltaY;

              if (touchPad) {
                if (!event.originalEvent) {
                  event.originalEvent = event;
                }

                deltaY = lethargy.check(event);

              } else {
                deltaY = Hamster.normalise.delta(event)[2] > 0 ? 1 : -1;
              }

              if (deltaY !== false) {
                isWheelZooming = true;

                $timeout.cancel(wheelTimeout);
                wheelTimeout = $timeout(() => {
                  isWheelZooming = false;
                }, touchPad ? zoomThrottle : 0);

                zoom(viewer, Math.max(0, vm.zoomLevel + deltaY));
              }
            };

            zoom = (viewer, level, cycle = false) => {
              let container = viewer.viewport.containerSize;
              let content = viewer.viewport.contentSize;

              let maxZoom = Math.min(content.x / container.x, content.y / container.y) / (($window.devicePixelRatio || 1) * maxZoomModifier);
              let maxZoomLevel = Math.round(maxZoom);

              if (level > maxZoomLevel) {
                level = cycle ? 0 : maxZoomLevel; // reset if cycled past max zoom
              }

              $timeout(() => {
                vm.zoomLevel = Math.max(minZoomLevel, level);

                if (vm.zoomLevel === maxZoomLevel) {
                  openSeadragonEl.addClass('max-zoom');
                } else {
                  openSeadragonEl.removeClass('max-zoom');
                }

                if (vm.zoomLevel === 0) { // reset
                  viewer.viewport.centerSpringX.animationTime = viewer.viewport.centerSpringY.animationTime = animationTimeQuick;

                  reset(viewer);

                } else if (vm.zoomLevel === 1) { // fill
                  viewer.viewport.centerSpringX.animationTime = viewer.viewport.centerSpringY.animationTime = animationTimeQuick;

                  $timeout(() => {
                    viewer.viewport.centerSpringX.animationTime = viewer.viewport.centerSpringY.animationTime = animationTime;
                  });

                  let scaleX = container.x / container.x;
                  let scaleY = (content.x / content.y) / (container.x / container.y);

                  let zoom = Math.max(scaleX, scaleY);

                  viewer.viewport.zoomTo(zoom);

                } else if (vm.zoomLevel === maxZoomLevel) { // max
                  viewer.viewport.centerSpringX.animationTime = viewer.viewport.centerSpringY.animationTime = animationTime;

                  viewer.viewport.zoomTo(maxZoom);

                } else {
                  viewer.viewport.centerSpringX.animationTime = viewer.viewport.centerSpringY.animationTime = animationTime;

                  viewer.viewport.zoomTo(vm.zoomLevel);
                }
              });
            };

            reset = (viewer, event) => {
              let p = new openSeadragon.Point();
              p.x = 0.5;
              p.y = viewer.viewport.contentAspectY / 2;

              let container = viewer.viewport.containerSize;
              let content = viewer.viewport.contentSize;

              let scaleX = (container.x - (margin * 2)) / container.x;
              let scaleY = (content.x / content.y) / (container.x / (container.y - (margin * 2)));

              let scale = Math.min(scaleX, scaleY);

              viewer.viewport
                .panTo(p)
                .zoomTo(scale);
            };

            let addEvents = (viewer) => {
              if (!isTouch) {
                moveHandlerFn = moveHandler.bind(null, viewer);
                wheelHandlerFn = wheelHandler.bind(null, viewer);
                resetFn = reset.bind(null, viewer);

                $document.on('mousemove', moveHandlerFn);
                $document.on('mousewheel', wheelHandlerFn);
                $document.on('DOMMouseScroll', wheelHandlerFn);

                angular.element(viewer.container).on('click', () => {
                  zoom(viewer, vm.zoomLevel + 1, true);
                });
              }
            };

            let readyImage = (viewer, eventType) => {
              if (isReady) {
                return;
              }

              isReady = true;

              openSeadragonEl.addClass('ready');

              $scope.$emit('hjCustomSeadragon:ready');

              viewer.viewport.centerSpringX.animationTime = viewer.viewport.centerSpringY.animationTime = 0;

              if (vm.zoomLevel > 0) {
                panTo(viewer, vm.focusPoint || {x: 0.5, y: 0.5});
              }

              $timeout(() => {
                viewer.viewport.centerSpringX.animationTime = viewer.viewport.centerSpringY.animationTime = animationTime;
              });

              addEvents(viewer);
            };

            let fullyLoadedHandler = (event) => {
              let viewer = event.eventSource.viewer;

              viewer.world.getItemAt(0).removeHandler('fully-loaded', fullyLoadedHandler);

              readyImage(viewer, 'fully-loaded');
            };

            let initImage = (viewer) => {
              $window.vp = viewer.viewport;

              viewer.world.getItemAt(0).addHandler('fully-loaded', fullyLoadedHandler);

              viewer.viewport.zoomSpring.animationTime = 0;

              zoom(viewer, vm.zoomLevel);

              viewer.viewport.zoomSpring.animationTime = animationTimeQuick;
            };

            $scope.$on('hjOpenSeadragon:tile-loaded', (event, obj) => {
              let viewer = obj.eventSource;

              $timeout.cancel(checkLoadedTimeout);

              checkLoadedTimeout = $timeout(() => {
                let loaded = true;
                let level = obj.tile.level;

                angular.forEach(obj.tiledImage.tilesMatrix[level], (tiles) => {
                  angular.forEach(tiles, (tile) => {
                    if (!tile.loaded) {
                      loaded = false;
                    }
                  });
                });

                if (loaded) {
                  readyImage(viewer, 'tile-loaded');
                }
              });
            });

            $scope.$on('hjOpenSeadragon:open', (event, obj) => {
              initImage(obj.eventSource);
            });

            $scope.$on('$destroy', () => {
              $document.off('mousemove', moveHandlerFn);
              $document.off('mousewheel', wheelHandlerFn);
              $document.off('DOMMouseScroll', wheelHandlerFn);
            });

          }],
      };
    }]);
