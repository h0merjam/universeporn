import angular from 'angular';

export default angular.module('hj.iframeEvents', [])

  .service('iframeEventsService', () => {
    let service;

    let setSource = (element) => {
      element.on('click mouseup mousedown mousemove touchend touchstart touchmove mousewheel keydown keyup keypress', (event) => {
        let doc;

        if (service.iframe) {
          doc = service.iframe;

        } else {
          if (element[0].querySelector('iframe')) {
            try {
              doc = element[0].querySelector('iframe').contentWindow.document;
            } catch (error) {
              //
            }
          }
        }

        if (!doc) {
          return;
        }

        let newEvent = doc.createEvent('Event');

        newEvent.initEvent(event.type, true, false);

        for (let key in event) {
          try {
            newEvent[key] = event[key];
          } catch (error) {}
        }

        doc.dispatchEvent(newEvent);
      });
    };

    service = {iframe: null, setSource};

    return service;
  })

  .directive('iframeEventsDst', ['iframeEventsService', (iframeEventsService) => {
    return {
      restrict: 'A',
      link: (scope, element, attrs) => {
        element.on('load', () => {
          iframeEventsService.iframe = element[0].contentWindow.document;
        });
      }
    };
  }])

  .directive('iframeEventsSrc', ['iframeEventsService', '$document', (iframeEventsService, $document) => {
    return {
      restrict: 'A',
      link: (scope, element, attrs) => {
        if (attrs.iframeEventsSrc === 'document') {
          iframeEventsService.setSource($document);

        } else {
          iframeEventsService.setSource(element);
        }
      }
    };
  }]);
