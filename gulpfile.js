var gulp = require("gulp");
var less = require("gulp-less");
var nano = require("gulp-cssnano");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var gulpif = require("gulp-if");
var autoprefixer = require("gulp-autoprefixer");
var sync = require("browser-sync").create();
var imagemin = require('gulp-imagemin');

var isDevelopment = false;

gulp.task("data",function(){
    return gulp.src("src/data/**/*")
        .pipe(gulp.dest("dist/data"));
});

gulp.task("img",function(){
    return gulp.src("src/img/**/*/")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"));
});

gulp.task("fonts",function(){
    return gulp.src("src/fonts/**/*/")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("js:own", function() {
    return gulp.src("src/js/main.js")
        .pipe(gulpif(isDevelopment,sourcemaps.init()))
        .pipe(uglify())
        .pipe(gulpif(isDevelopment,sourcemaps.write()))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("js:vendor", function() {
    return gulp.src([
        "node_modules/jquery/dist/jquery.js",
        "node_modules/masonry-layout/dist/masonry.pkgd.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/imagesloaded/imagesloaded.js",
        "node_modules/masonry-layout/dist/masonry.pkgd.js",
        "node_modules/toastr/build/toastr.min.js",
        "node_modules/jquery-validation/dist/jquery.validate.min.js",
        "node_modules/jquery-validation/dist/additional-methods.js",
        "node_modules/datatables.net/js/jquery.dataTables.js",
        "node_modules/datatables.net-bs/js/dataTables.bootstrap.js",
        "src/js/animatedModal.min.js"

    ])
        .pipe(concat("vendor.js"))
        .pipe(gulpif(!isDevelopment,uglify()))
        .pipe(gulp.dest("dist/js"));
});


gulp.task("css:vendor", function() {
    return gulp.src([
        "node_modules/bootstrap/dist/css/bootstrap.css",
        "node_modules/toastr/build/toastr.min.css",
        "node_modules/datatables.net-bs/css/dataTables.bootstrap.css",
        "src/css/font-awesome/css/font-awesome.min.css",        

    ])
        .pipe(gulpif(!isDevelopment,nano()))
        .pipe(concat("vendor.css"))
        .pipe(gulp.dest("dist/css"));
});

gulp.task("css:own", function() {
    return gulp.src("src/css/main.less")
        .pipe(gulpif(isDevelopment,sourcemaps.init()))
        .pipe(less())
        .pipe(autoprefixer("last 2 versions"))
        .pipe(nano())
        .pipe(gulpif(isDevelopment,sourcemaps.write()))
        .pipe(gulp.dest("dist/css"))
        .pipe(sync.stream());
});

gulp.task("html", function() {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"));
});
 

gulp.task("css", ["css:own", "css:vendor"]);
gulp.task("js", ["js:own", "js:vendor"]);
// gulp.task("img",["img"]);

gulp.task("watch",["build"],function(){
    sync.init({
        server: "dist"
    });

    gulp.watch("src/css/**/*.less",["css:own"]);
    gulp.watch("src/js/*.js",["js:own"]).on("change",sync.reload);

    gulp.watch("src/*.html",["html"]);
    gulp.watch("dist/*.html").on("change",sync.reload);
});

gulp.task("build", ["html", "css", "js","img","fonts","data"]);
gulp.task("default", ["build","watch"]);