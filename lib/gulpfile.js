'use strict';

var extend = require('extend-shallow');
var templates = require('./templates');
var defaults = require('./defaults');
var utils = require('./utils');

function GulpFile(options) {
  this.options = options || {};
  this.defaults = defaults;
  this.indent = this.options.indent || 0;
  this.plugins = {};
}

GulpFile.prototype.set = function(name, val) {
  this.plugins[name] = val;
  return this;
};

GulpFile.prototype.get = function(name) {
  return this.plugins[name];
};

GulpFile.prototype.has = function(name) {
  return this.plugins.hasOwnProperty(name);
};

GulpFile.prototype.createTask = function(options) {
  if (typeof options === 'string' && this.defaults.hasOwnProperty(options)) {
    return this.creatTask(this.defaults[options]);
  }

  if (Array.isArray(options)) {
    return this.creatTasks(options);
  }

  var opts = extend({}, this.options, options);
  if (!opts.taskname) {
    throw new TypeError('expected options.taskname to be a string');
  }

  var body = `return ${utils.appname(opts)}.src(${utils.src(opts)})${this.createPlugins(opts)}`;
  return templates.task(opts, body);
};

GulpFile.prototype.createTasks = function(config) {
  var self = this;
  return utils.arrayify(config).map(function(task) {
    if (typeof task === 'string') {
      if (!self.defaults.hasOwnProperty(task)) {
        throw new Error(task + ' is not implemented yet.');
      }
      task = self.defaults[task];
    }
    return self.createTask(task);
  }).join('\n');
};

GulpFile.prototype.createPlugins = function(options) {
  var opts = extend({}, this.options, options);
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
        return indent + utils.pipe(str).trim();
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

/**
 * Expose `GulpFile`
 */

module.exports = GulpFile;
