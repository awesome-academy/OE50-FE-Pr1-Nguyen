const { src, dest, parallel, watch, series } = require('gulp'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass')(require('sass')),
  pug = require('gulp-pug'),
  browserSync = require('browser-sync').create();

const FilesPath = {
  sassFiles: 'src/scss/*.scss',
  jsFiles: 'js/*.js',
  htmlFiles: 'src/pug/*.pug',
};
const { sassFiles, jsFiles, htmlFiles } = FilesPath;

function sassTask() {
  return src(sassFiles)
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function htmlTask() {
  return src(htmlFiles)
    .pipe(pug({ pretty: true }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src(jsFiles).pipe(concat('all.js')).pipe(dest('dist/js'));
}

function assetsTask() {
  return src('assets/**/*').pipe(dest('dist/assets'));
}

function serve() {
  browserSync.init({ server: { baseDir: './dist' } });
  watch(sassFiles, sassTask);
  watch(jsFiles, jsTask);
  watch(htmlFiles, htmlTask);
}

exports.js = jsTask;
exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, jsTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, jsTask, assetsTask));
