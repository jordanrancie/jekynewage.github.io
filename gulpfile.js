var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var plumberNotifier = require('gulp-plumber-notifier')
var clean = require('gulp-clean');
var pkg = require('./package.json');

 
gulp.task('clean', function () {
    return gulp.src(['./_site/static/*','_site/images/*'], {read: false})
        .pipe(plumberNotifier())
        .pipe(clean());
});

gulp.task('copy-static', function() {
    return gulp.src(['./static/**']).pipe(gulp.dest('./_site/static'));
})

gulp.task('copy-css', ['sass'], function() {
    return gulp.src(['./static/css/*']).pipe(gulp.dest('./_site/static/css'));
})

gulp.task('copy-images', function() {
    return gulp.src(['./images/**']).pipe(gulp.dest('./_site/images'));
})

gulp.task('copy-js', function() {
    return gulp.src(['./_static/js/*.js'])
        .pipe(gulp.dest('./_site/static/js'));
})

// SASS to css
gulp.task('sass',function(){
    return gulp.src('./_sass/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest("./static/css"));
});

gulp.task("minify-js", function() {
     return gulp.src("./static/js/scripts.js")
        .pipe(plumberNotifier())
        .pipe(uglify())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest("./static/js/"));

});

gulp.task("html-prettify", function() {
    return gulp.src('./*.html')
        .pipe(prettify({indent_char: " ", indent_size: 2}))
        .pipe(gulp.dest("./"));
});

gulp.task("minify-css", ['sass'], function() {
    return gulp.src('./static/css/style.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./static/css"));
});

gulp.task('watch:css', function () {
  gulp.watch('./static/css/*.css', ['copy-css']);
});

gulp.task('watch:sass', function () {
  gulp.watch(['./_sass/**/*.scss','./_sass/*.scss'], ['sass']);
});

gulp.task('watch:js', function () {
  gulp.watch("./static/js/scripts.js", ['copy-js','minify-js']);
});


gulp.task('default', ['copy-images', 'copy-static', 'minify-js', 'minify-css', 'watch:sass', 'watch:js']);
gulp.task('setup', ['copy-images', 'copy-static', 'minify-js', 'minify-css']);
gulp.task('watch', ['watch:css', 'watch:sass', 'watch:js']);