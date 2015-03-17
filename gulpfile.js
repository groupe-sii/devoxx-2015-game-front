/* jshint node:true */
/**
 * @author Wassim Chegham <maneki.nekko@gmail.com>
 */
'use strict';
var fs = require('fs');
var gulp = require('gulp');
var runseq = require('run-sequence');
var plato = require('plato');
var $ = require('gulp-load-plugins')();
var pkg = require('./package.json');
var banner = [
  '/**', 
  ' * <%= pkg.name %> - Copyright (c) <%= new Date().getFullYear() %> SII Group.', 
  ' * <%= pkg.description %>', 
  ' * @version v<%= pkg.version %>', 
  ' * @license <%= pkg.license %>', 
  ' */'
  ].join('\n');

// read initial config
var JS_FILES = ['app/scripts/**/*.js'];
var CSS_FILES = ['app/**/*.css'];
var HTML_FILES = ['app/**/*.html', 'components/**/*.html'];
var IMG_FILES = ['app/images/**/*'];
var FONT_FILES = ['app/fonts/**/*'];
var EXTRA_FILES = ['app/*.*', '!app/*.html', '!app/**/.DS_Store', 'node_modules/apache-server-configs/dist/.htaccess'];

/** define tasks **/
gulp.task('jshint', function() {
  return gulp.src(JS_FILES)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});


gulp.task('plato', function(done){
  var outputDir = './reporters/plato/';
  // null options for this example
  var options = {
    title: pkg.name+' - Plato Report'
  };

  var callback = function (report){
    console.log('plato report done.');
  };

  plato.inspect(JS_FILES, outputDir, options, callback);
  done();
});

gulp.task('styles', function() {
  return gulp.src(CSS_FILES)
    .pipe($.autoprefixer({
      browsers: ['last 1 version']
    }))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('html', ['styles'], function() {
  var assets = $.useref.assets({
    noconcat: false
  });
  return gulp.src(HTML_FILES)
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({
      conditionals: true,
      loose: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src(IMG_FILES)
    .pipe($.filter('**/*.{gif,jpeg,jpg,png,svg,webp}'))
    // .pipe($.cache($.imagemin({
    //   progressive: true,
    //   interlaced: true
    // })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')()
    .concat(FONT_FILES))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function() {
  return gulp.src(EXTRA_FILES, {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('connect', function() {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')().use(require('connect-livereload')({
      port: 35729
    })).use(serveStatic('.tmp')).use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components')).use(serveIndex('app'));
  require('http').createServer(app).listen(1337).on('listening', function() {
    console.log('Started connect web server on http://localhost:1337');
  });
});

gulp.task('serve', ['watch'], function() {
  require('opn')('http://localhost:1337');
});
// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;
  return gulp.src(HTML_FILES).pipe(wiredep()).pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function() {
  $.livereload.listen();
  var watching = [].concat(['.tmp/styles/**/*.css',
    JS_FILES,
    HTML_FILES,
    IMG_FILES,
    FONT_FILES
  ]);
  gulp.watch(watching).on('change', $.livereload.changed);
  gulp.watch(JS_FILES, ['jshint']);
  gulp.watch(CSS_FILES, ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('war', function() {
  gulp.src(["dist/**/*.*"])
        .pipe($.war({
            welcome: 'index.html',
            displayName: 'devoxx 2015 front',
        }))
        .pipe($.zip('Devoxx2015.war'))
        .pipe(gulp.dest("./dist"));
});

gulp.task('build', ['plato', 'jshint', 'html', 'images', 'fonts', 'extras'], function() {
  return gulp.src('dist/**/*')
    .pipe($.size({
      title: 'build done',
      gzip: true
    }));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'deploy', 'dist']));

gulp.task('default', ['clean'], function() {
  return gulp.start('build');
});
