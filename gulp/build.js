'use strict';

var gulp = require('gulp'),
    p = require('../package.json'),
    paths = gulp.paths,
    config = gulp.config,
    $ = require('gulp-load-plugins')();

gulp.task('html', function() {
    var assets = $.useref.assets({
        searchPath: ['.tmp', 'app', 'dist']
    });
    return gulp.src(config.HTML_FILES)
        .pipe(assets)

    .pipe($.if('*.js', $.sourcemaps.init()))
        .pipe($.if('*.js', $.uglify({
            preserveComments: 'all',
            mangle: false
        }).pipe($.header(config.BANNER, {
            pkg: p
        }))))
        .pipe($.if('*.js', $.sourcemaps.write()))

    .pipe($.if('*.css', $.cssmin().pipe($.header(config.BANNER, {
        pkg: p
    }))))

    .pipe(assets.restore())
        .pipe($.useref())

    .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'html'
        }));
});

gulp.task('images', function() {
    return gulp.src(config.IMG_FILES)
        .pipe($.filter('**/*.{gif,jpeg,jpg,png,svg,webp}'))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')()
            .concat(config.FONT_FILES))
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy', function() {
    var app = gulp.src(config.EXTRA_FILES, {
        dot: true
    }).pipe(gulp.dest('dist'));

    var audioFiles = gulp.src(['app/fx/**/*.{mp3,wav}'])
        .pipe(gulp.dest('dist/fx'));
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

gulp.task('vulcanize', function() {
    return gulp.src('app/components/components.html')
        .pipe($.vulcanize({
            dest: 'dist/components',
            inline: true,
            csp: true
        }))
        .pipe($.replace('url("../../app/', 'url("../../'))
        .pipe(gulp.dest('dist/components'))
        .pipe($.size({
            title: 'vulcanize'
        }));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'deploy', 'dist']));
