var gulp =  require('gulp');
var sass =  require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

/* Set Banner */
var banner = ['/*!\n',
  ' * Material Design - <%= pkg.title %> v<%= pkg.version %>\n',
  ' * Homepage: (<%= pkg.homepage %>)\n',
  ' * Copyright' + (new Date()).getFullYear(), ' Material Design for Bootstrap (http://mdbootstrap.com/)\n',
  ' * Licensed under <%= pkg.license %> (http://mdbootstrap.com/license/\n',
  ' */\n',
  ''
].join('');

var env = process.env.MODE_ENV || 'development';
var Dir = 'public/';

// Default task
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'copy']);

/* Compiles SCSS files from /sass into / css*/
gulp.task('sass', ()=>{
  return gulp.src('assets/sass/mdb.scss')
    .pipe(sass())
    .pipe(header(banner,{
      pkg: pkg
    }))
    .pipe(gulp.dest(Dir + 'css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
  return gulp.src(Dir + 'css/mdb.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(Dir + 'css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify custom JS
gulp.task('minify-js', function() {
  return gulp.src('assets/js/*.js')
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(Dir + 'js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('copy', function() {
  gulp.src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map'
    ])
    .pipe(gulp.dest('public/lib/bootstrap'))

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('public/lib/jquery'))

  gulp.src(['node_modules/popper.js/dist/umd/popper.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(gulp.dest('public/lib/popper'))

  gulp.src(['node_modules/jquery.easing/*.js'])
    .pipe(gulp.dest('public/lib/jquery-easing'))

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('public/lib/font-awesome'))

  gulp.src([
      'node_modules/datatables.net/js/*.js',
      'node_modules/datatables.net-bs4/js/*.js',
      'node_modules/datatables.net-bs4/css/*.css'
    ])
    .pipe(gulp.dest('public/lib/datatables/'))

  gulp.src('node_modules/ionicons/dist/**/*')
    .pipe(gulp.dest('public/lib/ionicons'))
})

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'public'
    },
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'minify-js'], function() {
  gulp.watch('assets/sass/**/*.scss', ['sass']);
  gulp.watch('assets/css/*.css', ['minify-css']);
  gulp.watch('assets/js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch(Dir + 'pages/*.html', browserSync.reload);
  gulp.watch(Dir + 'js/**/*.js', browserSync.reload);
});
