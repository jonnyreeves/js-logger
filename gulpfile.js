const packageJSON = require('./package.json');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const qunit = require('gulp-qunit');
const size = require('gulp-size');
const spawn = require('child_process').spawn;
 
const version = packageJSON.version;
const srcFile = 'lib/logger.bundle.js';

gulp.task('src_version', function () {
	return gulp.src(srcFile)
		.pipe(replace(/VERSION = "[^"]+"/, 'VERSION = "' + version + '"'))
		.pipe(gulp.dest('lib'));
});

gulp.task('bower_version', function () {
	return gulp.src('bower.json')
		.pipe(replace(/version": "[^"]+"/, 'version": "' + version + '"'))
		.pipe(gulp.dest('.'));
});

gulp.task('version', [ 'src_version', 'bower_version' ]);

gulp.task('test', [ 'version' ], function () {
	return gulp.src('test-src/index.html')
		.pipe(qunit());
});

gulp.task('minify', [ 'version' ], function () {
	return gulp.src(srcFile)
		.pipe(size({ showFiles: true }))
		.pipe(uglify())
		.pipe(rename('logger.min.js'))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest('lib'));
});

gulp.task('release', [ 'push_tag', 'publish_npm' ]);

gulp.task('push_tag', function (done) {
	const git = require('gulp-git');

	git.tag(version, 'v' + version);
	git.push('origin', 'master', {args: " --tags"}, function (err) {
		done(err);
	});
});

gulp.task('publish_npm', function (done) {
	spawn('npm', [ 'publish' ], { stdio: 'inherit' })
		.on('close', done);
});

gulp.task('default', [ 'version', 'test', 'minify' ]);
