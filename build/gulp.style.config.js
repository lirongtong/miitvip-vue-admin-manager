const gulp = require('gulp');
const lessCli = require('less');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.build.config');
const LessNpmImportPlugin = require('less-plugin-npm-import');
const through2 = require('through2');
const clean = require('gulp-clean-css');
const less = require('gulp-less');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const babelConfig = require('./babel.common.config')
const  { readFileSync, existsSync } = require('fs');
const postcss = require('postcss');
const postcssConfig = require('../postcss.config');
const distName = 'miitvip';

function transformLess(lessFile) {
    const resolvedLessFile = path.resolve(process.cwd(), lessFile);
    let data = readFileSync(resolvedLessFile, 'utf-8');
    data = data.replace(/^\uFEFF/, '');
    return lessCli.render(data, {
        paths: [path.dirname(resolvedLessFile)],
        filename: resolvedLessFile,
        plugins: [new LessNpmImportPlugin({prefix: '~'})],
        javascriptEnabled: true
    }).then(res => {
        const source = res.css;
        return postcss(postcssConfig.plugins).process(source, {
            from: undefined
        });
    }).then(r => {
        return r.css;
    });
}

gulp.task('less-to-css', (done) => {
    gulp.src(['../src/**/*.less', '../src/**/**/*.less'])
    .pipe(
        through2.obj(function(file, encoding, callback) {
            this.push(file.clone());
            if (
                file.path.match(/\\style\\index\.less$/) ||
                file.path.match(/\/style\/index\.less$/)
            ) {
                transformLess(file.path)
                .then(css => {
                    file.contents = Buffer.from(css);
                    file.path = file.path.replace(/\.less$/, '.css');
                    this.push(file);
                    callback();
                }).catch(e => {
                    console.error(e);
                });
            } else callback();
        })
    ).pipe(gulp.dest('../lib'));
    done();
});

gulp.task('ts-to-js', (done) => {
    gulp.src(['../src/**/**/*.ts'])
    .pipe(
        through2.obj(function(file, encoding, callback) {
            if (
                file.path.match(/\/style\/index\.(js|jsx|ts|tsx)$/) || 
                file.path.match(/\\style\\index\.(js|jsx|ts|tsx)$/)
            ) {
                const content = file.contents.toString(encoding);
                file.contents = Buffer.from(
                    content.replace(/\/style\/?'/g, "/style/css'").replace(/\.less/g, '.css')
                );
                file.path = file.path.replace(/index\.(js|jsx|ts|tsx)$/, 'mi.js');
                this.push(file);
                callback();
            } else callback();
        })
    ).pipe(gulp.dest('../lib'));
    done();
});

gulp.task('concat-css', (done) => {
    gulp.src(['../lib/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8']
    }))
    .pipe(concat(distName + '.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('../dist'));
    done();
});

gulp.task('minify-css', (done) => {
    gulp.src(['../lib/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8']
    }))
    .pipe(clean({compatibility: 'ie8'}))
    .pipe(concat(distName + '.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('../dist'));
    done();
});

gulp.task('compile-ts', (done) => {
    const dir = path.dirname(process.cwd());
    const distDir = dir + '/dist';
    const libDir = dir + '/lib';
    if (
        !existsSync(distDir) ||
        !existsSync(libDir)
    ) {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                console.error(err.stack || err);
                if (err.details) {
                    console.err(err.details);
                }
                return ;
            }
            done();
        });
    } else done();
});

gulp.task('default', gulp.series('compile-ts', gulp.parallel('less-to-css', 'ts-to-js'), 'concat-css', 'minify-css'));