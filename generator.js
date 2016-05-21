'use strict';

var fs = require('fs');
var path = require('path');
var dir = require('memoize-path')(__dirname);
var utils = require('./utils');

module.exports = function(app, base, env) {
  // if (utils.isRegistered(app, 'gulpfile')) return;
  // var cwd = dir('templates');

  // app.use(readPath());
  // app.use(keys());

  // app.create('gulpfiles', { renameKey: renameKey('stem') });
  // app.create('gulptasks', { renameKey: renameKey('stem'), viewType: 'partial' });

  // app.gulptasks(templates('tasks/*.js')());
  // app.gulpfiles(templates('files/*.js')());

  // console.log(app.gulpfiles.keys);
};

