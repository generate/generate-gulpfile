'use strict';

var path = require('path');
var dir = path.resolve.bind(path, __dirname);
var utils = require('./lib/utils');
var gulpfile = require('./index');

module.exports = function(app, base, env) {
  if (utils.isValid(app, 'generate-gulpfile')) return;
  var templates = path.resolve.bind(path, dir('templates'));
  var dest = app.options.dest || app.cwd;
  app.use(utils.keys());

  app.create('gulpfiles', { renameKey: utils.renameKey(dest, 'basename') });
  app.create('gulptasks', { renameKey: utils.renameKey(dest, 'basename'), viewType: 'partial' });

  app.task('custom', function(cb) {
    var plugins = [
      {
        taskname: 'default',
        plugins: ['istanbul', 'mocha', 'dest'],
        deps: ['bar', 'baz'],
        src: ['*.js'],
        dest: 'dist',
        devDependencies: ['gulp-mocha', 'gulp-istanbul']
      },
      {
        taskname: 'coverage',
        plugins: ['dest'],
        src: ['test/*.js', 'test.js', 'index.js', 'lib/*.js', 'test.js', '*.js', 'lib/utils.js'],
        dest: 'dist',
        devDependencies: ['gulp-istanbul']
      },
      {
        taskname: 'test',
        deps: ['coverage'],
        plugins: ['mocha', 'istanbul'],
        src: ['test/*.js'],
        devDependencies: ['gulp-mocha']
      },
      {
        taskname: 'lint',
        plugins: ['eslint'],
        src: ['*.js'],
        dest: 'dist',
        devDependencies: ['gulp-eslint']
      }
    ];

    var file = gulpfile.createTasks(plugins);
    console.log(file.contents.toString());
    app.gulpfile('gulpfile.js', {contents: file.contents});
    // console.log(app.gulpfiles.views);
    cb();
  });

  app.task('load', function(cb) {
    app.gulptasks(templates('tasks/*.js'));
    app.gulpfiles(templates('files/*.js'));
    // console.log(app.gulpfiles.views);
    cb();
  });

  app.task('default', ['load']);
};

