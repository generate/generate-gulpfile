gulp.task('eslint', function() {
  return gulp.src(['*.js', 'lib/*.js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});
