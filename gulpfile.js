'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    spritesmith = require('gulp.spritesmith'),
    cleancss = require("gulp-clean-css"),
    bourbon = require('node-bourbon'),
    server = require('gulp-server-livereload');




gulp.task('scss', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(gulp.dest('./www/css/'));
});

gulp.task('scss:watch', function () {
    gulp.watch('./scss/**/*.scss', ['scss']);
});

gulp.task('scss:sprites', function() {
    var spriteData =
        gulp.src('./sprites/**/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgPath: "../i/sprite.png",
                imgName: 'sprite.png',
                cssName: '_sprites.scss',
                padding: 5,
                cssVarMap: function (sprite) {
                    sprite.name = 'sprite-' + sprite.name;
                }
            }));

    spriteData.img.pipe(gulp.dest('./www/i/'));
    spriteData.css.pipe(gulp.dest('./scss/')); // путь, куда сохраняем стили
});

gulp.task('vendor:css', function () {
    return gulp.src(mainBowerFiles({
        filter:'**/*.css', //css
    }))
        .pipe(concat('vendor.css'))
        .pipe(cleancss({keepSpecialComments : 0}))
        .pipe(gulp.dest('./www/css'));
});

gulp.task('vendor:fonts', function () {
    return gulp.src(mainBowerFiles({
        filter:[
            '**/*.ttf',
            '**/*.woff',
            '**/*.woff2',
            '**/*.eot',
            '**/*.svg'
            ]
    })).pipe(gulp.dest('./www/fonts'));
});

gulp.task('vendor:js', function () {
    return gulp.src(mainBowerFiles({
            filter:'**/*.js', //css
        }))
        .pipe(concat('vendor.js'))
        .pipe(minify({mangle: true, noSource:true}))
        .pipe(gulp.dest('./www/js'));
});

gulp.task('js', function () {
    return gulp.src("./js/**/*.js")
        .pipe(concat('main.js'))
        .pipe(minify({mangle: true, noSource:true}).on('error', function(error) {
            console.log(error);
        }))
        .pipe(gulp.dest('./www/js'))

});

gulp.task('js:watch', function () {
    gulp.watch('./js/**/*.js', ['js']);
});

gulp.task('vendor:fonts', function () {
    return gulp.src(mainBowerFiles({
        filter:['**/*.ttf','**/*.otf','**/*.svg','**/*.woff','**/*.woff2'], //css
    })).pipe(gulp.dest('./www/fonts/'));
});


gulp.task('server:run', function() {

    gulp.src('./www/')
        .pipe(server({
            port: 3000,
            fallback: 'index.html',
            livereload: {
                enable: true
            },
            open: true
        }));

});


gulp.task('default', ['scss:sprites', 'scss', 'vendor:css', 'vendor:js', 'vendor:fonts', 'server:run']);