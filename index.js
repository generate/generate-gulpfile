'use strict';

var util = require('util');
var GulpFile = require('./lib/gulpfile');
var Files = require('./lib/files');
var utils = require('./lib/utils');
var gulpfile = new GulpFile();

gulpfile.set('dest', function(options) {
  return `${utils.appname(options)}.dest('${utils.formatPaths(options.dest)}')`;
});

gulpfile.set('mocha', function(options) {
  var mocha = util.inspect(options.mocha || {reporter: 'spec'});
  return `mocha(${mocha})`;
});

gulpfile.set('unused', function(options) {
  return `unused({keys: Object.keys(require(${options.keys}))})`;
});

gulpfile.set('eslint', ['eslint()', 'eslint.format()']);
gulpfile.set('istanbul', 'istanbul.writeReports()');

var res = gulpfile.createTasks([
  {
    taskname: 'default',
    plugins: ['istanbul', 'mocha', 'dest'],
    dependencies: ['bar', 'baz'],
    src: ['*.js'],
    dest: './dist',
    devDependencies: ['gulp-mocha', 'gulp-istanbul']
  },
  {
    taskname: 'coverage',
    plugins: ['dest'],
    src: ['test/*.js', 'test.js', 'index.js', 'lib/*.js', 'test.js'],
    dest: './dist',
    devDependencies: ['gulp-istanbul']
  },
  {
    taskname: 'test',
    plugins: ['dest'],
    src: ['*.js'],
    dest: './dist',
    devDependencies: ['gulp-mocha']
  },
  {
    taskname: 'lint',
    plugins: ['eslint'],
    src: ['*.js'],
    dest: './dist',
    devDependencies: ['gulp-eslint']
  }
]);

console.log(res);

// var files = new Files();
// var res = files.detect();
// console.log(res);
