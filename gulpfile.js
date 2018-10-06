const gulp = require('gulp'),
    composer = require('gulp-uglify/composer'),
    uglifyES = require('uglify-es');

const uglify = composer(uglifyES, console);

gulp.task('default', () => {
  return gulp.src('index.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
});