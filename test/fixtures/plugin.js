---
install: 
  dependencies: ['through2']
---
'use strict';

var through = require('through2');

module.exports = function(options) {
  return through.obj(function(file, enc, next) {
    var str = file.contents.toString();

    file.contents = new Buffer(str);
    next(null, file);
  });
};
