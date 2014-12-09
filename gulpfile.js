"use strict";

var gulp            = require('gulp'),
    jade            = require('gulp-jade'),
    stylus          = require('gulp-stylus'),
    autoprefixer    = require('gulp-autoprefixer'),
    minifycss       = require('gulp-minify-css'),
    jshint          = require('gulp-jshint'),
    uglify          = require('gulp-uglify'),
    imagemin        = require('gulp-imagemin'),
    rename          = require('gulp-rename'),
    concat          = require('gulp-concat'),
    notify          = require('gulp-notify'),
    cache           = require('gulp-cache'),
    livereload      = require('gulp-livereload'),
    connect         = require('gulp-connect'),
    del             = require('del');
  
    /////////////////////////////
    // File Location Variables //
    /////////////////////////////

    // Global
var app = {
        src     : './client/dev',
        dest    : './client/assets',
        root    : './client'
    };

    // Jade
    app.jade = {
        src     : app.src + '/jade/**/*.jade',
        dest    : './client'
    };

    // Stylus
    app.css = {
        src     : app.src + '/stylus/core.styl',
        dest    : app.dest + '/css',
        global  : app.src + '/stylus/**/*.styl'
    };

    // JavaScript
    app.js = {
        src     : [
            // Bower Components
            app.src + '/bower_components/jquery/dist/jquery.js',

            // Custom Dependencies
            app.src + '/scripts/libs/**/*.js',

            // Custom Files
            app.src + '/scripts/js/**/*.js'
        ],

        dest    : app.dest + '/js'
    };

    // Images
    app.img = {
        src     : app.src + '/images/**/*',
        dest    : app.dest + '/images/'
    };


    ////////////////////////////
    //////// Gulp Tasks ////////
    ////////////////////////////

    // Jade - Process .jade files to HTML
    gulp.task('jade', function(event) {
        return gulp.src(app.jade.src)
            .pipe(jade({ pretty: true}))
            .pipe(gulp.dest(app.jade.dest))
            .pipe(livereload())
            .pipe(notify({ subtitle: 'Jade', message: 'Processing completed' }));
    });

    // Stylus - Process .styl to minified css (gulp styles)
    gulp.task('styles', function() {
        return gulp.src(app.css.src)
            .pipe(stylus({ compress: false, 'include css': true }))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(gulp.dest(app.css.dest))
            .pipe(rename({suffix: '.min'}))
            .pipe(minifycss())
            .pipe(gulp.dest(app.css.dest))
            .pipe(livereload())
            .pipe(notify({ subtitle: 'Stylus', message: 'Processing completed' }));
    });

    // Scripts - Concat and minify all JS files defined in vars (gulp scripts)
    gulp.task('scripts', function() {
        return gulp.src(app.js.src)
          //.pipe(jshint('.jshintrc'))
          //.pipe(jshint.reporter('default'))
            .pipe(concat('scripts.js'))
            .pipe(gulp.dest(app.js.dest))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest(app.js.dest))
            .pipe(livereload())
            .pipe(notify({ subtitle: 'Scripts', message: 'Processing completed' }));
    });

    // Images - Minify images, cache result to prevent repeat (gulp images)
    gulp.task('images', function() {
        return gulp.src(app.img.src)
            .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
            .pipe(gulp.dest(app.img.dest))
            .pipe(livereload())
            .pipe(notify({ subtitle: 'Images', message: 'Processing completed' }));
    });

    // Exec / Shell / Run for Divshot

    gulp.task('copy', function(){
        gulp.src([
            app.src + '/stylus/fonts/*',
            app.src + '/bower_components/fontawesome/fonts/*'
            ])
            .pipe(gulp.dest(app.dest + '/css/fonts'));
    });

    // Clean - Deletes global dest folder (gulp clean)
    gulp.task('clean', function(cb) {
        del([app.root + '/assets', app.root + '/**/*.html'], cb)
    });

    // Watch
    gulp.task('watch', function() {

        // Watch .jade files
        gulp.watch(app.jade.src, ['jade']);

        // Watch .styl files
        gulp.watch(app.css.global, ['styles']);

        // Watch .js files
        gulp.watch(app.js.src, ['scripts']);

        // Watch image files
        gulp.watch(app.img.src, ['images']);

        // Create LiveReload Server
        livereload.listen();

        // Watch for src folder changes and reload
        gulp.watch([app.src]).on('change', livereload.changed);

    });
    
    gulp.task('connect', function() {
        connect.server({
            root: app.root,
            port: 4000
        });
    });


    ////////////////////////////
    ///// Final Gulp Tasks /////
    ////////////////////////////

    // Default Task (gulp)
    gulp.task('build', ['clean'], function() {
        gulp.start('jade', 'styles', 'scripts', 'images', 'copy');
    });

    gulp.task('default', [ 'connect', 'watch', 'build' ]);

    // Deployment (gulp deploy)
    gulp.task('deploy', ['clean'], function() {
        gulp.start('jade', 'styles', 'scripts', 'images', 'copy' /*,exec - divshot*/);
    });













