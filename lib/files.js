'use strict';

var fs = require('fs');
var path = require('path');
var extend = require('extend-shallow');
var union = require('union-value');
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
  union(this, 'patterns', patterns);
  this.configs[name] = patterns;
  return this;
};

Files.prototype.detect = function(keys, options) {
  if (typeof keys !== 'string' && !Array.isArray(keys)) {
    this.initDefaults();
    keys = Object.keys(this.configs);
  }
  keys = utils.arrayify(keys);
  var opts = extend({cwd: process.cwd()}, options);
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
        union(configs, key, pattern);
        configs[key].sort();
      }
    }
  }
  return reduce(configs);
};

function reduce(configs) {
  for (var key in configs) {
    if (configs.hasOwnProperty(key)) {
      var arr = configs[key];
      if (arr.length === 1) {
        continue;
      }

      for (var i = 0; i < arr.length; i++) {
        var pattern = arr[i];
        var temp = arr.slice();
        temp.splice(i, 1);
        utils.mm(temp, pattern).forEach(function(key) {
          arr.splice(arr.indexOf(key), 1);
        });
      }
    }
  }
  return arr;
}

/**
 * Expose `Files`
 */

module.exports = Files;
