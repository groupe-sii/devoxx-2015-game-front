/* jshint node:true */
/**
 * @author Wassim Chegham <maneki.nekko@gmail.com>
 * @author Vincent Ogloblinsky <vincent.ogloblinsky@gmail.com>
 */

'use strict';

var gulp = require('gulp'),
  p = require('../package.json'),
  paths = gulp.paths,
  config = gulp.config,
  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
  });

gulp.task('wiredep', function() {
  // inject bower components
  var wiredep = require('wiredep').stream;
  return gulp.src(config.HTML_FILES)
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
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
  require('http').createServer(app).listen(config.PORT_DEV).on('listening', function() {
    console.log('Started connect web server on http://localhost:' + config.PORT_DEV);
  });
});

gulp.task('watch', ['connect'], function() {
  $.livereload.listen();
  var watching = [].concat([
    '.tmp/styles/**/*.css',
    config.JS_FILES,
    config.HTML_FILES,
    config.IMG_FILES,
    config.FONT_FILES
  ]);
  gulp.watch(watching).on('change', $.livereload.changed);
  gulp.watch(config.JS_FILES, ['jshint']);
  gulp.watch(config.CSS_FILES, ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('serve', ['watch'], function() {
  require('opn')('http://localhost:' + config.PORT_DEV);
});
