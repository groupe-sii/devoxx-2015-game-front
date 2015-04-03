/* jshint node:true */
/**
 * @author Wassim Chegham <maneki.nekko@gmail.com>
 * @author Vincent Ogloblinsky <vincent.ogloblinsky@gmail.com>
 */

'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    pattern: ['run-sequence']
  });

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  doc: 'doc',
  picFolder: 'ci'
};

gulp.config = {
  JS_FILES: ['app/scripts/**/*.js'],
  CSS_FILES: ['app/styles/**/*.css', '!app/styles/animations/**'],
  HTML_FILES: ['app/**/*.html', '!app/{components,test}/**/*.html'],
  IMG_FILES: ['app/images/**/*'],
  EXTRA_FILES: ['app/*.*', '!app/*.html', '!app/**/.DS_Store', 'node_modules/apache-server-configs/dist/.htaccess'],
  FONT_FILES: ['app/fonts/**/*'],
  CSS_ANIMATIONS: ['app/styles/animations/**'],
  AUTOPREFIXER_BROWSERS: [
    'ie >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23'
  ],
  OUTPUT_DIRS: {
    PLATO: 'reporters/plato/',
    STYLES: '.tmp/styles',
    ANIMATIONS_STYLES: 'dist/styles/animations'
  },
  PORT_DEV: 1337,
  BANNER: [
    '/**',
    ' * <%= pkg.name %> - Copyright (c) <%= new Date().getFullYear() %> SII Group.',
    ' * <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '',
    ''
  ].join('\n')
};

require('require-dir')('./gulp');

gulp.task('build', ['clean'], function(cb) {
  return $.runSequence(
    ['copy', 'styles', 'animation-styles'], ['plato', 'images', 'fonts', 'html'],
    'vulcanize',
    'update-server-url',
    'war',
    cb);
});

gulp.task('default', function(){
  gulp.start('build');
});