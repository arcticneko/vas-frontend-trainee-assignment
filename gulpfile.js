const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const webpackStream = require("webpack-stream");
const rename = require("gulp-rename");

// JS

const jsbuild = () => {
  return gulp.src('source/js/banner.js')
    .pipe(webpackStream(webpackConfig), 'webpack --mode development')
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('source/js'));
};

exports.jsbuild = jsbuild;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source',
    },
    cors: true,
    notify: false,
    ui: false,
    port: '3999',
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
  gulp.watch("source/js/**/*.js").on("change", sync.reload);
}

exports.default = gulp.series(
  jsbuild, styles, server, watcher
);
