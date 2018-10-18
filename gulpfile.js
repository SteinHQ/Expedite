const gulp = require('gulp'),
    composer = require('gulp-uglify/composer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglifyES = require('uglify-es');

const uglify = composer(uglifyES, console);

gulp.task('default', () => {
  return gulp.src('index.js')
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'));
});