/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://git.makeit.vip            |
 * | Date: 2020-5-29 15:49                     |
 * +-------------------------------------------+
 */
const gulp = require('gulp');
const clean = require('gulp-clean-css');
const less = require('gulp-less');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('css', () => {
	return new Promise(function(resolve) {
		gulp.src('../src/styles/makeit.less')
		.pipe(less())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions', 'ie > 8']
		}))
		.pipe(clean())
		.pipe(rename('makeit-admin.min.css'))
		.pipe(gulp.dest('../dist'));
		resolve();
	});
});

gulp.task('fonts', () => {
	return new Promise(function(resolve) {
		gulp.src('../src/fonts/*.*')
		.pipe(gulp.dest('../dist/fonts'));
		resolve();
	});
});

gulp.task('default', gulp.parallel(['css', 'fonts']));
