gulp.task('lint', function() {
  return gulp.src(['*.js', 'test/*.js'].concat(lib))
    .pipe(eslint())
    .pipe(eslint.format());
});