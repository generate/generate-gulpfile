'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var utils = module.exports = require('lazy-cache')(require);
var fn = require;
require = utils;

require('arr-flatten', 'flatten');
require('extend-shallow', 'union');
require('is-valid-app', 'isValid');
require('isobject', 'isObject');
require('matched', 'glob');
require('micromatch', 'mm');
require('mixin-deep', 'merge');
require('union-value', 'union');
require = fn;

/**
 * Utils
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.pipe = function(str) {
  return `.pipe(${str.trim()})`;
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

utils.reducePatterns = function(configs) {
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
};

utils.renameKey = function(dest, prop) {
  return function(key, file) {
    var fns = {
      dirname: function(k) {
        return path.dirname(k);
      },
      relative: function(k) {
        return path.relative(dest, path.resolve(k));
      },
      basename: function(k) {
        return path.basename(k);
      },
      stem: function(k) {
        return path.basename(k, path.extname(k));
      },
      extname: function(k) {
        return path.extname(k);
      }
    };
    return file ? file[prop] : fns[prop](key);
  };
};

utils.keys = function(options) {
  return function fn(app) {
    if (!this.isViews) return fn;
    Object.defineProperty(this, 'keys', {
      get: function() {
        return Object.keys(this.views);
      }
    });
  };
};

utils.readPath = function(options) {
  return function fn(view) {
    if (!this.isView) return fn;
    var contents = null;
    var content = null;

    Object.defineProperty(this, 'contents', {
      set: function(val) {
        contents = val;
        content = val.toString();
      },
      get: function() {
        var buffer = contents || (contents = fs.readFileSync(this.path));
        if (buffer) {
          content = buffer.toString();
          return buffer;
        }
      }
    });

    Object.defineProperty(this, 'content', {
      set: function(val) {
        content = val;
        if (typeof val === 'string') {
          contents = new Buffer(val);
        }
      },
      get: function() {
        var str = content || (content = fs.readFileSync(this.path, 'utf8'));
        if (typeof str !== 'string') {
          str = str.toString();
        }
        contents = new Buffer(str);
        return str;
      }
    });
  };
};
