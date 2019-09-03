'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var merge = require('merge-stream');

gulp.task('copyVendorResources', function () {
    var taskTinyMCE = gulp
        .src([
            path.join(conf.wiredep.directory, 'tinymce/plugins/**/*'),
            path.join(conf.wiredep.directory, 'tinymce/skins/**/*'),
            path.join(conf.wiredep.directory, 'tinymce/themes/**/*')
        ], {base: path.join(conf.wiredep.directory, 'tinymce')})
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'serve/scripts')));

    var taskPhotoSwipe = gulp
        .src([
            path.join(conf.wiredep.directory, 'photoswipe/dist/default-skin/*')
        ], {base: path.join(conf.wiredep.directory, 'photoswipe/dist/default-skin')})
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'serve/styles')));

    return merge(taskTinyMCE, taskPhotoSwipe);
});

