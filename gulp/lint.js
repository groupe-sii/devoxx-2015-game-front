'use strict';

var gulp = require('gulp'),
    p = require('../package.json'),
    paths = gulp.paths,
    config = gulp.config,
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'run-sequence', 'plato']
    });

gulp.task('jshint', function() {
    return gulp.src(config.JS_FILES)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('plato', function() {
    var options = {
        title: p.name + ' - Plato Report'
    };

    var callback = function(report) {
        console.log('Plato report done.');
    };

    return $.plato.inspect(config.JS_FILES, config.OUTPUT_DIRS.PLATO, options, callback);
});
