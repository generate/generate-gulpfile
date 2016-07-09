'use strict';

var util = require('util');
var GulpFile = require('./lib/gulpfile');
var Files = require('./lib/files');
var utils = require('./lib/utils');
var gulpfile = new GulpFile();

gulpfile.addPlugin('dest', function(config) {
  return `${utils.appname(config)}.dest('${utils.formatPaths(config.dest)}')`;
});

gulpfile.addPlugin('mocha', function(config) {
  var mocha = util.inspect(config.mocha || {reporter: 'spec'});
  return `mocha(${mocha})`;
});

gulpfile.addPlugin('unused', function(config) {
  return `unused({keys: Object.keys(require(${config.keys}))})`;
});

gulpfile.addPlugin('eslint', ['eslint()', 'eslint.format()']);
gulpfile.addPlugin('istanbul', 'istanbul.writeReports()');

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

// var lint = gulpfile.createTask('lint', {
//   plugins: ['eslint'],
//   src: ['*.js'],
//   dest: 'dist',
//   devDependencies: ['gulp-eslint']
// });
// console.log(lint);

var files = new Files();
var res = files.toPatterns();
console.log(res);
