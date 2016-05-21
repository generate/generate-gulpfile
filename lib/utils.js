'use strict';

var util = require('util');
var utils = module.exports = require('lazy-cache')(require);
var Files = require('./files');
var fn = require;
require = utils;

require('matched', 'glob');
require('arr-flatten', 'flatten');
require('micromatch', 'mm');
require = fn;

/**
 * Utils
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.pipe = function(str) {
  return `.pipe(${str})`;
};

utils.src = function(opts) {
  if (!opts.src) {
    throw new TypeError('expected options.src to be a string or array');
  }
  var files = new Files();
  files.set('src', utils.arrayify(opts.src));
  var src = files.detect('src');
  return utils.formatArg(utils.formatPaths(src));
};

utils.deps = function(opts) {
  return opts.dependencies ? (utils.formatArg(opts.dependencies) + ', ') : '';
};

utils.appname = function(opts) {
  return opts.appname || 'gulp';
};

utils.formatArg = function(val) {
  return util.inspect(val)
    .replace(/^\[ /, '[')
    .replace(/ \]$/, ']');
};

utils.formatPaths = function(val) {
  if (Array.isArray(val)) {
    if (val.length === 1) {
      val = val[0];
    } else {
      val = val.map(function(str) {
        return utils.stripDot(str);
      });
    }
  }
  if (typeof val === 'string') {
    val = utils.stripDot(val);
  }
  return val;
};

utils.stripDot = function(str) {
  return str.replace(/^\.[\\\/]/, '');
};
