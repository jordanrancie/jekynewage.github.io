const gulp = require("gulp");
const plumberNotifier = require("gulp-plumber-notifier");
const browserSync = require("browser-sync").create();
const autoPrefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const csscomb = require("gulp-csscomb");
const rename = require('gulp-rename');
const csso = require("gulp-csso");
const inject = require("gulp-inject");
const series = require("stream-series");
const uglify = require("gulp-uglify");
const prettify = require("gulp-html-prettify");

// Directories path
var baseDir = "./static/sass/base/";
var layoutDir = "./static/sass/layout/";
var pagesDir = "./static/sass/pages/";
var themesDir = "./static/sass/themes/";
var shrotcodesDir = "./static/sass/shortcodes/";
var styleCss = [baseDir+"*.scss", layoutDir+"*.scss", pagesDir+"*.scss"];

// Autoprefixer config
const AUTOPREFIXER_BROWSERS = [
    "last 2 version",
    "> 1%",
    "ie >= 9",
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 4",
    "bb >= 10"
];

// Server task
gulp.task("serve", function() {
    browserSync.init({
        server: "./",
        notify: false
    });
});

// Shortcode sass to css
gulp.task("shortcode", function() {
    return gulp.src(shrotcodesDir + "shortcodes.scss")
        .pipe(plumberNotifier())
        .pipe(sass())
        .pipe(autoPrefixer(AUTOPREFIXER_BROWSERS))
        .pipe(csscomb())
        .pipe(gulp.dest("./static/css"))
        .pipe(browserSync.stream())
        .pipe(csso())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest("./static/css"));
});

// Theme sass to css
gulp.task("theme", function() {
    return gulp.src(themesDir + "*.scss")
        .pipe(plumberNotifier())
        .pipe(sass())
        .pipe(autoPrefixer(AUTOPREFIXER_BROWSERS))
        .pipe(csscomb())
        .pipe(gulp.dest("./static/css"))
        .pipe(browserSync.stream())
        .pipe(csso())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest("./static/css"));
});

// Style sass to css
gulp.task("style", function() {
    return gulp.src("./static/sass/style.scss")
        .pipe(plumberNotifier())
        .pipe(sass())
        .pipe(autoPrefixer(AUTOPREFIXER_BROWSERS))
        .pipe(csscomb())
        .pipe(gulp.dest("./static/css"))
        .pipe(browserSync.stream())
        .pipe(csso())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest("./static/css"));
});

gulp.task("watch", ["serve"], function() {
    gulp.watch(shrotcodesDir + "*.scss", ["shortcode"]);
    gulp.watch(themesDir + "*.scss", ["theme"]);
    gulp.watch(styleCss, ["style"]);

    gulp.watch("./*.html", browserSync.reload);
    gulp.watch("./static/js/*.js", browserSync.reload);
});

gulp.task("inject", function() {
    var vendorPaths = [
        "!./static/vendor/jquery",
        "!./static/vendor/slider-revolution/**",
        "!./static/vendor/modernizr",
        "!./static/vendor/backward",
        "!./static/vendor/bootstrap/**",
        "!./static/vendor/masonry",
        "./static/vendor/**",
        "./static/vendor/**/**",
        "./static/vendor/**/**/**"
    ];

    var main = gulp.src([
        "./static/vendor/modernizr/*.js",
        "./static/vendor/jquery/**.js",
        "./static/vendor/bootstrap/**/bootstrap.min.js",
        "./static/vendor/bootstrap/**/bootstrap.min.css"
    ], {
        read: false
    });

    var project = gulp.src([
        "./static/js/scripts.js",
        "./static/css/shortcodes.css",
        "./static/css/style.css",
        "./static/css/default-theme.css"
    ], {
        read: false
    });

    var vendorJS = vendorPaths.map(function(item) { return item + "/*.js"; });
    var vendorCSS = vendorPaths.map(function(item) { return item + "/*.css"; });
    var libs = gulp.src(vendorJS.concat(vendorCSS), {read:false});

    return gulp.src("./*.html")
        .pipe(inject(series(main, libs, project), {relative: true}))
        .pipe(gulp.dest("./"));

    // return gulp.src("./200-resource-paths.html")
    //     .pipe(inject(series(main, libs, project), {relative: true}))
    //     .pipe(gulp.dest("./"));
});

gulp.task("script", function() {
    return gulp.src("./static/js/scripts.js")
        .pipe(plumberNotifier())
        .pipe(uglify())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest("./static/js/"));

});

gulp.task("html-prettify", function() {
    gulp.src('./*.html')
        .pipe(prettify({indent_char: " ", indent_size: 4}))
        .pipe(gulp.dest("./"));
});

gulp.task("default", ["serve", "shortcode", "style", "theme", "watch"]);