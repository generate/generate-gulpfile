gulp.task('coverage', function() {
  return gulp.src(['index.js', 'utils.js', 'lib/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});
