'use strict';

var templates = require('./templates');
var defaults = require('./defaults');
var Files = require('./files');
var utils = require('./utils');

function GulpFile(options) {
  this.options = options || {};
  this.indent = this.options.indent || 0;
  this.templates = utils.merge({}, templates, this.options.templates);
  this.tasks = utils.merge({}, defaults, this.options.tasks);
  this.plugins = {};
  this.tasks = {};
}

GulpFile.prototype.addPlugin = function(name, val) {
  this.plugins[name] = val;
  return this;
};

GulpFile.prototype.getPlugin = function(name) {
  return this.plugins[name];
};

GulpFile.prototype.hasPlugin = function(name) {
  return this.plugins.hasOwnProperty(name);
};

GulpFile.prototype.createPlugins = function(config) {
  var opts = utils.merge({}, this.options, config);
  var arr = opts.plugins;

  if (typeof arr === 'undefined') return ';';
  if (typeof arr === 'string') arr = [arr];
  var indent = opts.indent || '    ';
  var prefix = opts.prefix || '\n' + indent;
  var self = this;

  var res = arr.map(function(name) {
    if (!self.plugins.hasOwnProperty(name)) {
      throw new Error(name + ' is not implemented yet.');
    }

    var plugin = self.plugins[name];
    if (typeof plugin === 'function') {
      return utils.pipe(plugin(opts));
    }

    if (Array.isArray(plugin)) {
      return plugin.map(function(str) {
        return indent + utils.pipe(str);
      }).join('\n').trim();
    }
    return utils.pipe(plugin);
  });

  if (opts.literal) {
    res += utils.arrayify(opts.literal).map(function(str) {
      return utils.pipe(str);
    }).join('\n');
  }
  return prefix + res.join(prefix) + ';';
};

GulpFile.prototype.getTask = function(name) {
  if (!this.tasks.hasOwnProperty(name)) {
    throw new Error(name + ' is not implemented yet.');
  }
  return this.tasks[name];
};

GulpFile.prototype.createTask = function(name, config) {
  if (utils.isObject(name)) {
    config = name;
    name = null;
  }

  if (typeof name === 'string' && !utils.isObject(config)) {
    return this.createTask(this.getTask(name));
  }

  if (Array.isArray(config)) {
    return this.createTasks(config);
  }

  var opts = utils.merge({}, this.config, config);
  if (typeof name === 'string') {
    opts.taskname = name;
  }

  if (!opts.taskname) {
    throw new TypeError('expected config.taskname to be a string');
  }

  var body = this.templates.body(opts, this.createPlugins(config));
  config.contents = this.templates.task(opts, body);

  // remove duplicate and overlapping patterns from `src`
  config.src = utils.reducePattern(config.src);
  return config;
};

GulpFile.prototype.createTasks = function(tasks) {
  var config = {contents: '', dependencies: [], devDependencies: []};
  tasks = utils.arrayify(tasks);
  var len = tasks.length;
  var idx = -1;

  while (++idx < len) {
    var task = tasks[idx];
    utils.union(config, 'dependencies', task.dependencies);
    utils.union(config, 'devDependencies', task.devDependencies);
    config.contents += this.createTask(task).contents;
    config.contents += '\n';
  }
  config.contents = new Buffer(config.contents);
  return config;
};

/**
 * Expose `GulpFile`
 */

module.exports = GulpFile;
