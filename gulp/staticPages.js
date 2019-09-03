'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var merge = require('merge-stream');

gulp.task('copyStaticPages', function () {
    var wechatOAuth = gulp
        .src([
            path.join(conf.paths.src, '/wechat_oauth.html')
        ])
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));

    var weiboOAuth = gulp
        .src([
            path.join(conf.paths.src, '/weibo_oauth.html')
        ])
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));

    var qqOAuth = gulp
        .src([
            path.join(conf.paths.src, '/qq_oauth.html')
        ])
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));

    return merge(wechatOAuth, weiboOAuth, qqOAuth);
});

