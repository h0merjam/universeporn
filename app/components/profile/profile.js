import angular from 'angular';
import profileComponent from './profile.component';

const profileModule = angular.module('profile', [])

  .directive('profile', profileComponent);

export default profileModule;
