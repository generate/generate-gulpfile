'use strict';

var fs = require('fs');
var path = require('path');
var debug = require('debug')('generate:gulpfile');
var utils = exports = module.exports = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('isobject', 'isObject');
require = fn;

utils.isRegistered = function(app, name) {
  if (!utils.isObject(app)) {
    throw new Error('expected an instance of Generate');
  }
  if (!app.isApp && !app.isGenerator) {
    return true;
  }
  if (app.isRegistered('generate-' + name)) {
    return true;
  }
  debug('initializing <%s>, from <%s>', __filename, module.parent.id);
};

function renameKey(prop) {
  return function(key, file) {
    var fns = {
      dirname: function(k) {
        return path.dirname(k);
      },
      relative: function(k) {
        return path.relative(process.cwd(), path.resolve(k));
      },
      basename: function(k) {
        return path.basename(k);
      },
      filename: function(k) {
        return path.basename(k, path.extname(k));
      },
      stem: function(k) {
        return path.basename(k, path.extname(k));
      },
      extname: function(k) {
        return path.extname(k);
      },
      ext: function(k) {
        return path.extname(k);
      }
    };

    if (file) {
      file.filename = file.stem;
      file.ext = file.extname;
      return file[prop];
    }

    return fns[prop](key);
  };
}

utils.keys = function(options) {
  return function keysPlugin(app) {
    if (!this.isViews) return keysPlugin;
    Object.defineProperty(this, 'keys', {
      get: function() {
        return Object.keys(this.views);
      }
    });
  };
};

utils.readPath = function(options) {
  return function readPathPlugin(view) {
    if (!this.isView) return readPathPlugin;
    var contents = null;
    var content = null;

    Object.defineProperty(this, 'contents', {
      set: function(val) {
        contents = val;
        content = val.toString();
      },
      get: function() {
        var buf = contents || (contents = fs.readFileSync(this.path));
        content = buf.toString();
        return buf;
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
