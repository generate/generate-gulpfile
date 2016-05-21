'use strict';

var utils = require('./utils');

module.exports = {
  task: function(opts, body) {
return `${utils.appname(opts)}.task('${opts.taskname}', ${utils.deps(opts)}function() {
  ${body}
});`
  }
};
