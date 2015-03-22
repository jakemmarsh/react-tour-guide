'use strict';

var gulp        = require('gulp');
var del         = require('del');
var react       = require('gulp-react');
var runSequence = require('run-sequence');
var stripDebug  = require('gulp-strip-debug');
var gulpif      = require('gulp-if');

gulp.task('clean', function(cb) {

  return del(['./dist/css/*', './dist/js/*'], cb);

});

gulp.task('styles', function() {

  return gulp.src('./lib/styles/**/*.css')
  .pipe(gulp.dest('./dist/css/'));

});

gulp.task('scripts', function() {

  return gulp.src('./lib/js/**/*.js')
  .pipe(react())
  .pipe(gulpif(global.isProd, stripDebug()))
  .pipe(gulp.dest('./dist/js/'));

});

gulp.task('dev', function() {

  global.isProd = false;

  runSequence(['styles', 'scripts']);

  gulp.watch('./lib/js/**/*.js',      ['scripts']);
  gulp.watch('./lib/styles/**/*.css', ['styles']);

});

gulp.task('prod', ['clean'], function() {

  global.isProd = true;

  return runSequence(['styles', 'scripts']);

});