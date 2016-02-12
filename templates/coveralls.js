'use strict';

var path = require('path');
var gulp = require('gulp');
var coveralls = require('gulp-coveralls');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');

gulp.task('lint', function() {
  return gulp.src(['test/*.js', 'lib/*.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .on('error', console.log);
});

gulp.task('test', function(cb) {
  gulp.src(['lib/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .on('finish', function() {
      gulp.src(['test/*.js'], {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .on('error', cb)
        .pipe(istanbul.writeReports())
        .on('end', cb);
  });
});

gulp.task('coveralls', ['test'], function() {
  if (!process.env.CI) return;
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('default', ['lint', 'test', 'coveralls']);
