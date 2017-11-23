var gulp = require('gulp');
var AceDev = require('@homerjam/ace-dev-webpack');

gulp.tasks = AceDev.gulp(__dirname).tasks;
