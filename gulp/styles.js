'use strict';

var gulp = require('gulp'),
    p = require('../package.json'),
    paths = gulp.paths,
    config = gulp.config,
    $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
    return gulp.src(config.CSS_FILES)
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer(config.AUTOPREFIXER_BROWSERS))
        .pipe($.cssmin())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.OUTPUT_DIRS.STYLES))
        .pipe($.size({
            title: config.CSS_FILES
        }));
});

gulp.task('animation-styles', function() {
    return gulp.src(config.CSS_ANIMATIONS)
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer(config.AUTOPREFIXER_BROWSERS))
        .pipe($.cssmin())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.OUTPUT_DIRS.ANIMATIONS_STYLES))
        .pipe($.size({
            title: config.CSS_ANIMATIONS
        }));
});
