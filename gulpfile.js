var packageJSON = require('./package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var qunit = require('gulp-qunit');
var jshint = require('gulp-jshint');
var size = require('gulp-size');

var versionedName = 'logger-' + packageJSON.version;

gulp.task('clean', function () {
	gulp.src('dist', { read: false }).pipe(clean());
	gulp.src('build', { read: false }).pipe(clean());
});

gulp.task('build', [ 'clean' ], function () {
	return gulp.src('src/logger.js')
	 .pipe(replace(/@VERSION@/g, packageJSON.version))
	 .pipe(gulp.dest('build'));
});

gulp.task('lint', [ 'build' ], function () {
	return gulp.src('src/*.js')
	 .pipe(jshint())
	 .pipe(jshint.reporter('default'))
	 .pipe(jshint.reporter('fail'));
});

gulp.task('test', function () {
	return gulp.src('test-src/index.html')
	 .pipe(qunit());
});

gulp.task('dist', [ 'build', 'lint', 'test' ], function ()
{
	return gulp.src('build/logger.js')
	 .pipe(gulp.dest('dist'))
	 .pipe(rename(versionedName + '.js'))
	 .pipe(size({ showFiles: true }))
	 .pipe(uglify())
	 .pipe(rename(versionedName + '.min.js'))
	 .pipe(size({ showFiles: true }))
	 .pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'dist' ]);