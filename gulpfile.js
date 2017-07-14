var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|svg|gif|jpg|jpeg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', babel({
      presets: ['es2015']
    })))
    .pipe(gulpif('*.js', uglify().on('error', function(e) {
      console.log(e);
    })))
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
});

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass', 'useref', browserSync.reload]);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// development
gulp.task('default', function(callback) {
  runSequence(['sass', 'useref', 'fonts', 'browserSync'], 'watch',
    callback
    )
});

// production
gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  )
});