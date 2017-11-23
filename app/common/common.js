import angular from 'angular';
import hjOpenSeadragon from './directives/hjOpenSeadragon';
import hjCustomSeadragon from './directives/hjCustomSeadragon';
import hjVimeoApi from './directives/hjVimeoApi';
import hjIframeEvents from './directives/hjIframeEvents';
import hjSplitCursor from './directives/hjSplitCursor';
import hjShine from './directives/hjShine';
import hjIsScrolling from './directives/hjIsScrolling';
import hjScrollMonitor from './directives/hjScrollMonitor';

const commonModule = angular.module('app.common', [
  hjOpenSeadragon.name,
  hjCustomSeadragon.name,
  hjVimeoApi.name,
  hjIframeEvents.name,
  hjSplitCursor.name,
  hjShine.name,
  hjIsScrolling.name,
  hjScrollMonitor.name,
]);

export default commonModule;
