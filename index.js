const path = require('path');
const AceApp = require('@homerjam/ace-app-webpack');

AceApp.app({
  version: require('./package.json').version,
  banner: 'ascii-banner',
  siteTitle: 'Universe Porn',
  googleAnalyticsTrackingId: 'UA-55066881-30',

  stylesheets: [
    '/font/univers/demo-async.css',
    '/font/karinatwiss/css/karinatwiss.css',
  ],
  scripts: [],

  htmlAttr: 'ng-class="{loading: $root.loading}"',
  bodyAttr: 'data-state="{{$root.$state.current.name}}" data-viewer-schema="{{$root.viewerSchema}}" hj-split-cursor="{left: 0.1, right: 0.1}"',

  themeColor: '#000000',

  viewsDir: path.resolve(__dirname, 'views'),
  routesDir: path.resolve(__dirname, 'routes'),
  publicDir: path.resolve(__dirname, 'public'),
});
