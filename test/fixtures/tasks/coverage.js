gulp.task('coverage', function() {
  return gulp.src(lib)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});
