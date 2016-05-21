gulp.task('unused', function() {
  return gulp.src(['index.js', 'lib/**/*.js', 'bin/*.js'])
    .pipe(unused({keys: Object.keys(require('./lib/utils.js'))}))
});
