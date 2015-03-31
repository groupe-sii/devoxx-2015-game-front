/* jshint node:true */
/**
 * @author Wassim Chegham <maneki.nekko@gmail.com>
 */
'use strict';
var fs = require('fs');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var plato = require('plato');
var $ = require('gulp-load-plugins')();
var pkg = require('./package.json');
var banner = [
  '/**', 
  ' * <%= pkg.name %> - Copyright (c) <%= new Date().getFullYear() %> SII Group.', 
  ' * <%= pkg.description %>', 
  ' * @version v<%= pkg.version %>', 
  ' * @license <%= pkg.license %>', 
  ' */',
  '',
  ''
  ].join('\n');

// read initial config
var PORT_DEV = 1337;
var JS_FILES = ['app/scripts/**/*.js'];
var CSS_FILES = ['app/styles/**/*.css', '!app/styles/animations/**'];
var CSS_ANIMATIONS = ['app/styles/animations/**'];
var HTML_FILES = ['app/**/*.html', '!app/{components,test}/**/*.html'];
var IMG_FILES = ['app/images/**/*'];
var FONT_FILES = ['app/fonts/**/*'];
var EXTRA_FILES = ['app/*.*', '!app/*.html', '!app/**/.DS_Store', 'node_modules/apache-server-configs/dist/.htaccess'];
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23'
];

/** define tasks **/

gulp.task('jshint', function() {
  return gulp.src(JS_FILES)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});


gulp.task('plato', function(done){
  var outputDir = 'reporters/plato/';
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
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.cssmin())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size({title: CSS_FILES}));
});

gulp.task('animation-styles', function() {
  return gulp.src(CSS_ANIMATIONS)
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.cssmin())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/styles/animations'))
    .pipe($.size({title: CSS_ANIMATIONS}));
});

gulp.task('html', function() {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', 'dist']});
  return gulp.src(HTML_FILES)
    .pipe(assets)

    .pipe( $.if('*.js', $.sourcemaps.init()) )
    .pipe( $.if('*.js', $.uglify({
      preserveComments:'all',
      mangle: false
    }).pipe($.header(banner, { pkg : pkg } )) ))
    .pipe( $.if('*.js', $.sourcemaps.write()) )
    
    .pipe( $.if('*.css', $.cssmin().pipe($.header(banner, { pkg : pkg } )) ))

    .pipe(assets.restore())
    .pipe($.useref())

    .pipe( $.if('*.html', $.minifyHtml({
      conditionals: true,
      loose: true,
      quotes: true,
      empty: true,
      spare: true
    })))

    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
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

gulp.task('copy', function () {
  var app = gulp.src(EXTRA_FILES, {
    dot: true
  }).pipe(gulp.dest('dist'));

  var bower = gulp.src([
    'app/bower_components/**/*'
  ]).pipe(gulp.dest('dist/bower_components'));

  var audioFiles = gulp.src(['app/fx/**/*.{mp3,wav}'])
    .pipe(gulp.dest('dist/fx'));

  // var animationsStyles = gulp.src(['app/styles/animations/**/*.css'])
  //   .pipe(gulp.dest('dist/styles/animations'));

  // var vulcanized = gulp.src(['app/components/components.html'])
  //   .pipe($.rename('components.vulcanized.html'))
  //   .pipe(gulp.dest('dist/components'));

  // return $.merge(app, bower, /*components,*/ vulcanized)
  //   .pipe($.size({title: 'copy'}));
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
  require('http').createServer(app).listen(PORT_DEV).on('listening', function() {
    console.log('Started connect web server on http://localhost:'+PORT_DEV);
  });
});

gulp.task('serve', ['watch'], function() {
  require('opn')('http://localhost:'+PORT_DEV);
});

gulp.task('wiredep', function() {
  // inject bower components
  var wiredep = require('wiredep').stream;
  return gulp.src(HTML_FILES)
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function() {
  $.livereload.listen();
  var watching = [].concat([
    '.tmp/styles/**/*.css',
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
  return gulp.src(['dist/'])
    .pipe($.war({
      welcome: 'index.html',
      displayName: 'Survival Game Client (devoxx 2015)',
    }))
    .pipe($.zip('survival-game-client.war'))
    .pipe(gulp.dest('deploy/'));
});

gulp.task('vulcanize', function () {
  return gulp.src('app/components/components.html')
    .pipe($.vulcanize({
      dest: 'dist/components',
      inline: true,
      csp: true
    }))
    .pipe( $.replace('url("../../app/', 'url("../../') )
    .pipe(gulp.dest('dist/components'))
    .pipe($.size({title: 'vulcanize'}));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'deploy', 'dist']));

gulp.task('default', ['clean'], function (cb) {
  return runSequence(
    ['copy', 'styles', 'animation-styles'],
    ['plato', 'images', 'fonts', 'html'],
    'vulcanize',
    'war',
    cb);
});
