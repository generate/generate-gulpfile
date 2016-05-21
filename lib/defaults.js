'use strict';

module.exports = {
  test: {
    dependencies: ['coverage'],
    plugins: ['mocha', 'istanbul'],
    src: 'test/*.js'
  },
  lint: {
    plugins: ['mocha', 'istanbul'],
    src: ['*.js', 'test/*.js'],
    literal: ['eslint()', 'eslint.format()']
  },
  unused: {
    src: ['index.js', 'lib/**/*.js', 'bin/*.js'],
    keys: './lib/utils.js'
  }
};
