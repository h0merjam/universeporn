/* eslint-env browser */

import angular from 'angular';

import OpenSeadragon from 'openseadragon';
// import OpenSeadragon from 'script-loader!openseadragon/build/openseadragon/openseadragon';
// import OpenSeadragon from 'script-loader!./openseadragon';
import 'script-loader!lethargy';
import 'script-loader!hamsterjs/hamster';

const openSeadragon = OpenSeadragon;
// const openSeadragon = window.OpenSeadragon;

export default angular.module('hj.customSeadragon', [])
  .directive('hjCustomSeadragon', ['$window', '$document',
    function hjCustomSeadragonDirective ($window, $document) {
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
          function hjCustomSeadragonController ($rootScope, $scope, $element, $window, $timeout) {
            'ngInject';

            const vm = this;

            const isTouch = 'ontouchstart' in $window;

            const margin = 80;
            const zoomThrottle = 1000;
            const animationTime = isTouch ? 1 : 5;
            const animationTimeQuick = isTouch ? 0.5 : 1;
            const maxZoomModifier = 1;
            const minZoomLevel = 0;

            let isWheelZooming = false;
            let isReady = false;

            let reset;
            let zoom;
            let moveHandlerFn;
            let wheelHandlerFn;
            let resetFn;
            let checkLoadedTimeout;
            let wheelTimeout;

            vm.zoomLevel = vm.zoomLevel || 2;
            let prevZoomLevel = vm.zoomLevel;

            const openSeadragonEl = $element.children();

            const lethargy = new $window.Lethargy();

            vm.openSeadragonOptions = {
              constrainDuringPan: true,
              visibilityRatio: 1,
              minZoomLevel: isTouch ? 0.6 : 1,
              defaultZoomLevel: 1,
              maxZoomPixelRatio: $window.devicePixelRatio / 2,
              homeFillsViewer: true,
              showZoomControl: false,
              showHomeControl: false,
              showFullPageControl: false,
              animationTime,
              panHorizontal: isTouch,
              panVertical: isTouch,
              // immediateRender: true,
              mouseNavEnabled: !!isTouch,
              // gestureSettingsMouse: {
              //   scrollToZoom: false,
              //   clickToZoom: false,
              // },
              gestureSettingsTouch: {
                flickEnabled: true,
              },
            };

            const panTo = (viewer, point) => {
              const container = viewer.viewport.containerSize;
              const content = viewer.viewport._contentSize;
              const imageZoom = viewer.viewport.viewportToImageZoom(viewer.viewport.getZoom());
              const bounds = viewer.viewport.getBounds();

              const imageMinusContainerRatio = {
                x: (content.x - (container.x * (1 / imageZoom))) / content.x,
                y: (content.y - (container.y * (1 / imageZoom))) / content.x,
              };

              const newPoint = new openSeadragon.Point();

              newPoint.x = point.x * imageMinusContainerRatio.x;
              newPoint.y = point.y * imageMinusContainerRatio.y;

              newPoint.x += (bounds.width * 0.5);
              newPoint.y += (bounds.height * 0.5);

              viewer.viewport.panTo(newPoint);
            };

            const moveHandler = (viewer, event) => {
              const container = viewer.viewport.containerSize;
              const content = viewer.viewport._contentSize;
              const imageZoom = viewer.viewport.viewportToImageZoom(viewer.viewport.getZoom());

              if (content.x * imageZoom < container.x - 1 || content.y * imageZoom < container.y - 1 || vm.zoomLevel === 0) {
                // reset(viewer);
                return;
              }

              const mouseX = event.clientX / container.x;
              const mouseY = event.clientY / container.y;

              panTo(viewer, { x: mouseX, y: mouseY });
            };

            const deltaBuffer = [120, 120, 120];

            const isDivisible = function isDivisible (n, divisor) {
              return (Math.floor(n / divisor) === n / divisor);
            };

            const isTouchpad = function isTouchpad (deltaY) {
              if (!deltaY) {
                return null;
              }
              deltaY = Math.abs(deltaY);
              deltaBuffer.push(deltaY);
              deltaBuffer.shift();
              const allDivisable = (isDivisible(deltaBuffer[0], 120) &&
                isDivisible(deltaBuffer[1], 120) &&
                isDivisible(deltaBuffer[2], 120));
              return !allDivisable;
            };

            const wheelHandler = function wheelHandler (viewer, event) {
              if (vm.disabled || isWheelZooming) {
                return;
              }

              event = event.originalEvent || event;

              event.preventDefault();

              if (event.deltaY === -0) {
                return;
              }

              const touchPad = isTouchpad(event.wheelDeltaY || event.wheelDelta || event.detail || 0);

              let deltaY;

              if (touchPad) {
                if (!event.originalEvent) {
                  event.originalEvent = event;
                }

                deltaY = lethargy.check(event);

              } else {
                deltaY = $window.Hamster.normalise.delta(event)[2] > 0 ? 1 : -1;
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
              const container = viewer.viewport.containerSize;
              const content = viewer.viewport._contentSize;

              const scaleX = container.x / container.x;
              const scaleY = (content.x / content.y) / (container.x / container.y);

              const fillZoom = Math.max(scaleX, scaleY);

              const maxZoom = Math.min(content.x / container.x, content.y / container.y) / (($window.devicePixelRatio || 1) * maxZoomModifier);
              const maxZoomLevel = Math.round(maxZoom);

              if (level > maxZoomLevel) {
                level = cycle ? 0 : maxZoomLevel; // reset if cycled past max zoom
              }

              $timeout(() => {
                vm.zoomLevel = Math.max(minZoomLevel, level);

                // skip zoom level if lower than fill zoom
                if (vm.zoomLevel > 1 && vm.zoomLevel < maxZoomLevel) {
                  if (vm.zoomLevel < fillZoom) {
                    if (prevZoomLevel > vm.zoomLevel) {
                      vm.zoomLevel = 1;
                    } else {
                      vm.zoomLevel = Math.ceil(fillZoom) + 1;
                    }
                  }
                }

                if (vm.zoomLevel === maxZoomLevel) {
                  openSeadragonEl.addClass('max-zoom');
                } else {
                  openSeadragonEl.removeClass('max-zoom');
                }

                if (vm.zoomLevel === 0) { // reset
                  // viewer.viewport.centerSpringX.animationTime = animationTimeQuick;
                  // viewer.viewport.centerSpringY.animationTime = animationTimeQuick;

                  reset(viewer);

                } else if (vm.zoomLevel === 1) { // fill
                  viewer.viewport.centerSpringX.animationTime = animationTimeQuick;
                  viewer.viewport.centerSpringY.animationTime = animationTimeQuick;

                  $timeout(() => {
                    viewer.viewport.centerSpringX.animationTime = animationTime;
                    viewer.viewport.centerSpringY.animationTime = animationTime;
                  });

                  viewer.viewport.zoomTo(fillZoom);

                } else if (vm.zoomLevel === maxZoomLevel) { // max
                  viewer.viewport.centerSpringX.animationTime = animationTime;
                  viewer.viewport.centerSpringY.animationTime = animationTime;

                  viewer.viewport.zoomTo(maxZoom);

                } else {
                  viewer.viewport.centerSpringX.animationTime = animationTime;
                  viewer.viewport.centerSpringY.animationTime = animationTime;

                  viewer.viewport.zoomTo(vm.zoomLevel);
                }

                prevZoomLevel = vm.zoomLevel;
              });
            };

            reset = (viewer, event) => {
              const p = new openSeadragon.Point();
              p.x = 0.5;
              p.y = (1 / viewer.viewport._contentAspectRatio) / 2;

              const container = viewer.viewport.containerSize;
              const content = viewer.viewport._contentSize;

              const scaleX = (container.x - (margin * 2)) / container.x;
              const scaleY = (content.x / content.y) / (container.x / (container.y - (margin * 2)));

              const scale = Math.min(scaleX, scaleY);

              viewer.viewport
                .panTo(p)
                .zoomTo(scale);
            };

            const addEvents = (viewer) => {
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

            const readyImage = (viewer, eventType) => {
              if (isReady) {
                return;
              }

              isReady = true;

              openSeadragonEl.addClass('ready');

              $scope.$emit('hjCustomSeadragon:ready');

              viewer.viewport.centerSpringX.animationTime = 0;
              viewer.viewport.centerSpringY.animationTime = 0;

              if (vm.zoomLevel > 0) {
                panTo(viewer, vm.focusPoint || { x: 0.5, y: 0.5 });
              }

              $timeout(() => {
                viewer.viewport.centerSpringX.animationTime = animationTime;
                viewer.viewport.centerSpringY.animationTime = animationTime;
              });

              addEvents(viewer);
            };

            const fullyLoadedHandler = (event) => {
              const viewer = event.eventSource.viewer;

              viewer.world.getItemAt(0).removeHandler('fully-loaded-change', fullyLoadedHandler);

              readyImage(viewer, 'fully-loaded-change');
            };

            const initImage = (viewer) => {
              $window.vp = viewer.viewport;

              viewer.world.getItemAt(0).addHandler('fully-loaded-change', fullyLoadedHandler);

              viewer.viewport.zoomSpring.animationTime = 0;

              zoom(viewer, vm.zoomLevel);

              viewer.viewport.zoomSpring.animationTime = animationTimeQuick;
            };

            $scope.$on('hjOpenSeadragon:tile-loaded', (event, obj) => {
              const viewer = obj.eventSource;

              $timeout.cancel(checkLoadedTimeout);

              checkLoadedTimeout = $timeout(() => {
                let loaded = true;
                const level = obj.tile.level;

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
