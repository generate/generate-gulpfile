'use strict';

var merge = require('mixin-deep');
var path = require('path');

module.exports = function(app, base, env) {
  app.use(renderString());

  app.task('default', function(cb) {
    app.toStream('templates', filter(app.options))
      .pipe(app.dest(rename(app, app.options)))
      .on('finish', cb);
  });

  app.task('custom', function(cb) {
    app.engine(['text', 'tmpl'], require('engine-base'));

    app.create('gulpfile');
    app.create('gulptask', {
      viewType: 'partial',
      renameKey: function(key, file) {
        return file ? file.filename : path.basename(key, path.extname(key));
      }
    });

    app.gulptasks('templates/tasks/*.tmpl', {cwd: __dirname});
    app.gulpfiles('templates/files/*.tmpl', {cwd: __dirname});

    app.helper('gulpRequires', function(tasks) {
      tasks = [].concat.apply([], tasks);

      var res = [];
      tasks.forEach(function(task) {
        res.push('var ' + task + ' = require(\'gulp-' + task + '\');');
      });

      return res.join('\n');
    });

    app.asyncHelper('gulpTasks', function(tasks, cb) {
      tasks = [].concat.apply([], tasks);
      var footer = [];
      var body = [];

      var len = tasks.length;
      var idx = -1;

      while (++idx < len) {
        var task = tasks[idx];
        var view = this.app.gulptasks.getView(task);
        if (view) {
          body.push(view.content);
          footer.push(task);
        }
      }

      var str = footer.join('\', \'');
      var res = body.join('\n');
      res += '\ngulp.task(\'default\', [\'' + str + '\']);';
      var locals = createContext(tasks);
      app.renderString(res, locals, cb);
    });

    var options = {
      name: 'tasks',
      message: 'Which tasks would you like to include?',
      choices: Object.keys(app.views.gulptasks).filter(function(task) {
        return !/-/.test(task);
      })
    };

    app.choices('tasks', options, function(err, answers) {
      if (err) return cb(err);

      app.toStream('gulpfiles', filter(app.options, 'custom.tmpl'))
        .pipe(app.renderFile('text', answers))
        .on('error', done(cb))
        .pipe(app.dest(rename(app, app.options)))
        .on('error', done(cb))
        .on('finish', done(cb));
    });
  });
};

function filter(options, name) {
  var filename = options.file || name || 'gulpfile.js';
  return function(key, file) {
    var isMatch = filename === key
      || filename === file.basename
      || filename === file.stem;

    file.basename = 'gulpfile.js';
    return isMatch;
  };
}

function done(app, cb) {
  app.questions.set('install-gulp', 'Do you want to install gulp and devDependencies now?');
  return function(err) {
    console.log(err || 'created gulpfile.js');
    app.ask('install-gulp', function(err, answers) {

      // if (answers['install-gulp'])
    });
  };
}

function rename(app, options) {
  var dest = options.cwd || app.cwd;

  return function(file) {
    file.base = file.dest || dest || '';
    file.path = path.join(file.base, file.basename);
    file.basename = file.basename.replace(/^_/, '.');
    file.basename = file.basename.replace(/^\$/, '');
    return file.base;
  };
}

function renderString(options) {
  return function(app) {
    app.define('renderString', function(str, locals, cb) {
      if (typeof locals === 'function') {
        cb = locals;
        locals = {};
      }

      locals = locals || {};
      var view = app.view({path: 'temp.text', content: str});
      if (locals.engine) view.engine = locals.engine;
      var ctx = merge({}, this.context, locals);

      app.render(view, ctx, function(err, res) {
        if (err) return cb(err);
        cb(null, res.content);
      });
    })
  };
}

function createContext(tasks) {
  var context = {};
  var len = tasks.length;
  var idx = -1;
  while (++idx < len) {
    var task = tasks[idx];
    context[task] = true;
  }
  if (context.mocha || context.coverage) {
    context.coverage = true;
    context.mocha = true;
  }
  return context;
}
