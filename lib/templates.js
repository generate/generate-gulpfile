'use strict';

var utils = require('./utils');
var Files = require('./files');

module.exports = {
  body: function(config, str) {
    return `return ${utils.appname(config)}.src(${Files.src(config)})${str}`;
  },
  task: function(config, str) {
    return `${utils.appname(config)}.task('${config.taskname}', ${utils.deps(config)}function() {\n  ${str}\n});\n`;
  }
};
