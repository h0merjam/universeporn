import angular from 'angular';
import notFound from './notFound/notFound';
import menu from './menu/menu';
import home from './home/home';
import portfolio from './portfolio/portfolio';
import profile from './profile/profile';
import viewer from './viewer/viewer';
import archive from './archive/archive';
import archiveViewer from './archiveViewer/archiveViewer';

let componentModule = angular.module('app.components', [
  notFound.name,
  menu.name,
  home.name,
  portfolio.name,
  profile.name,
  viewer.name,
  archive.name,
  archiveViewer.name,
]);

export default componentModule;
