'use strict';

var gulp        = require('gulp');
var del         = require('del');
var react       = require('gulp-react');
var runSequence = require('run-sequence');

gulp.task('clean', function() {

  return del(['./dist/css/*', './dist/js/*']);

});

gulp.task('styles', function() {

  return gulp.src('./lib/styles/**/*.css')
  .pipe(gulp.dest('./dist/css/'));

});

gulp.task('scripts', function() {

  return gulp.src('./lib/js/**/*.js')
  .pipe(react())
  .pipe(gulp.dest('./dist/js/'));

});

gulp.task('build', ['clean'], function() {

  return runSequence(['styles', 'scripts']);

});