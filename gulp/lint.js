'use strict';

var gulp = require('gulp'),
    p = require('../package.json'),
    paths = gulp.paths,
    config = gulp.config,
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'run-sequence', 'plato']
    }),

    JSReporter = require('../' + paths.picFolder + '/jsReporter.js'),
    jsReporter = new JSReporter('jsHint.json'),

    CSSReporter = require('../' + paths.picFolder + '/cssReporter.js'),
    cssReporter = new CSSReporter('cssLint.json'),

    HTMLReporter = require('../' + paths.picFolder + '/htmlReporter.js'),
    htmlReporter = new HTMLReporter('htmlHint.json');

gulp.task('jshint', function() {
    jsReporter.openReporter(p.name, './', 'js');
    return gulp.src(config.JS_FILES)
        .pipe($.jshint())
        .pipe(jsReporter.reporter)
        .pipe($.jshint.reporter('jshint-stylish'))
        .on('end', jsReporter.closeReporter.bind(jsReporter));
});

gulp.task('css-lint', function() {
    cssReporter.openReporter(p.name, './', 'css');
    return gulp.src(config.CSS_FILES)
        .pipe($.csslint('.csslintrc'))
        .pipe($.csslint.reporter(cssReporter.reporter.bind(cssReporter)))
        .on('end', cssReporter.closeReporter.bind(cssReporter));
});

gulp.task('html-hint', function() {
    htmlReporter.openReporter(p.name, './', 'html');
    return gulp.src(config.HTML_FILES)
        .pipe($.htmlhint({
            htmlhintrc: '.htmlhintrc'
        }))
        .pipe($.htmlhint.reporter(htmlReporter.reporter.bind(htmlReporter)))
        .on('end', htmlReporter.closeReporter.bind(htmlReporter));
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
