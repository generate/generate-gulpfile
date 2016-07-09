'use strict';

var utils = require('./utils');

function Files(options) {
  this.options = options || {};
  this.patterns = [];
  this.configs = {};
  this.cache = {};
}

Files.prototype.initDefaults = function() {
  this.set('test', ['test/*.js', 'test.js']);
  this.set('coverage', ['index.js', 'lib/*.js', 'utils.js', this.patterns.slice()]);
  this.set('lint', ['*.js', this.patterns.slice()]);
};

Files.prototype.set = function(name, patterns) {
  utils.union(this, 'patterns', patterns);
  this.configs[name] = patterns;
  return this;
};

Files.prototype.toPatterns = function(keys, options) {
  if (typeof keys !== 'string' && !Array.isArray(keys)) {
    this.initDefaults();
    keys = Object.keys(this.configs);
  }

  keys = utils.arrayify(keys);
  var opts = utils.merge({cwd: process.cwd()}, options);
  var configs = {};
  var len = keys.length;
  var idx = -1;

  while (++idx < len) {
    var key = keys[idx];
    if (!this.configs.hasOwnProperty(key)) {
      throw new Error('config "' + key + '" is not registered');
    }

    var val = this.configs[key];
    var arr = utils.flatten(utils.arrayify(val));
    for (var i = 0; i < arr.length; i++) {
      var pattern = arr[i];
      var files = this.cache[pattern] || utils.glob.sync(pattern, opts);
      if (files.length) {
        this.cache[pattern] = files;
        utils.union(configs, key, pattern);
        configs[key].sort();
      } else {
        configs[key] = this.configs[key];
      }
    }
  }
  return utils.reducePatterns(configs);
};

Files.src = function(config) {
  config = config || {};

  if (!config.src) {
    throw new TypeError('expected options.src to be a string or array');
  }

  var files = new Files();
  files.set('src', utils.arrayify(config.src));
  var src = files.toPatterns('src');
  return utils.formatArg(utils.formatPaths(src));
};

/**
 * Expose `Files`
 */

module.exports = Files;
