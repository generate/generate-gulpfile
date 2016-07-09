'use strict';

var path = require('path');
var dir = path.resolve.bind(path, __dirname);
var utils = require('./lib/utils');

module.exports = function(app, base, env) {
  if (utils.isValid(app, 'generate-gulpfile')) return;
  var templates = path.resolve.bind(path, dir('templates'));
  var dest = app.options.dest || app.cwd;

  app.use(utils.keys());

  app.create('gulpfiles', { renameKey: utils.renameKey(dest, 'stem') });
  app.create('gulptasks', { renameKey: utils.renameKey(dest, 'stem'), viewType: 'partial' });

  app.task('default', function(cb) {
    app.gulptasks(templates('tasks/*.js'));
    app.gulpfiles(templates('files/*.js'));


    console.log(app.gulpfiles.keys);
    cb();
  });
};

