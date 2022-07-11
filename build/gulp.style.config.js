const gulp = require('gulp')
const lessCli = require('less')
const path = require('path')
const ts = require('gulp-typescript')
const tsConfig = require('./ts.config')
const tsReportDefault = ts.reporter.defaultReporter()
const lessNpmImport = require('less-plugin-npm-import')
const through2 = require('through2')
const merge2 = require('merge2')
const clean = require('gulp-clean-css')
const less = require('gulp-less')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const rimraf = require('rimraf')
const autoPrefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const babelConfig = require('./babel.common.config')
const { readFileSync } = require('fs')
const postcss = require('postcss')
const postcssConfig = require('../postcss.config')

const dirs = {
    lib: '../lib',
    es: '../es',
    dist: '../dist'
}
const distName = 'miitvip'

const transformLess = async (lessFile) => {
    const resolvedLessFile = path.resolve(process.cwd(), lessFile)
    let data = readFileSync(resolvedLessFile, 'utf-8')
    data = data.replace(/^\uFEFF/, '')
    return lessCli.render(data, {
        paths: [path.dirname(resolvedLessFile)],
        filename: resolvedLessFile,
        plugins: [new lessNpmImport({prefix: '~'})],
        javascriptEnabled: true
    })
    .then((res) => {
        const source = res.css
        return postcss(postcssConfig.plugins).process(source, {
            from: undefined
        })
    })
    .then((r) => {
        return r.css
    })
}

const babelify = (js, modules) => {
    const config = babelConfig(modules)
    config.babelrc = false
    return js.pipe(babel(config))
        .pipe(
            through2.obj(function(file, encoding, callback) {
                this.push(file.clone())
                if (
                    file.path.match(/\/style\/index\.(js|jsx|ts|tsx)$/) || 
                    file.path.match(/\\style\\index\.(js|jsx|ts|tsx)$/)
                ) {
                    const content = file.contents.toString(encoding)
                    file.contents = Buffer.from(
                        content.replace(/\/style\/?'/g, "/style/css'").replace(/\.less/g, '.css')
                    )
                    file.path = file.path.replace(/index\.(js|jsx|ts|tsx)$/, 'mip.js')
                    this.push(file)
                    callback()
                }
            })
        )
        .pipe(gulp.dest(modules === false ? dirs.es : dirs.lib))
}

const compile = (modules) => {
    rimraf.sync(modules === false ? dirs.es : dirs.lib)
    const lessStream = gulp.src(['../src/**/*.less', '../src/**/**/*.less'])
        .pipe(
            through2.obj(function(file, _encoding, callback) {
                this.push(file.clone())
                if (
                    file.path.match(/\\style\\index\.less$/) ||
                    file.path.match(/\/style\/index\.less$/)
                ) {
                    transformLess(file.path)
                        .then(css => {
                            file.contents = Buffer.from(css)
                            file.path = file.path.replace(/\.less$/, '.css')
                            this.push(file)
                            callback()
                        })
                        .catch(e => {
                            console.error(e)
                        })
                } else callback()
            })
        )
        .pipe(gulp.dest(modules === false ? dirs.es : dirs.lib))
    let error = 0
    const sources = [
        '../src/**/*.js',
        '../src/**/*.jsx',
        '../src/**/*.ts',
        '../src/**/*.tsx',
        'types/**/*.d.ts'
    ]
    const tsResult = gulp.src(sources)
        .pipe(ts(tsConfig(modules), {
            error(e) {
                tsReportDefault.error(e)
                error = 1
            },
            finish: tsReportDefault.finish
        }))
    const check = () => {
        if (error) process.exit(1)
    }
    tsResult.on('finish', check)
    tsResult.on('end', check)
    const tsFileStream = babelify(tsResult.js, modules)
    const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? dirs.es : dirs.lib))
    return merge2([lessStream, tsFileStream, tsd])
}

gulp.task('compile-with-es', gulp.series(done => {
    compile(false).on('finish', () => {
        done()
    })
}))

gulp.task('compile', gulp.series('compile-with-es', done => {
    compile().on('finish', () => {
        done()
    })
}))

gulp.task('concat-css', (done) => {
    const stream = gulp.src([dirs.lib + '/**/*.css'])
        .pipe(less())
        .pipe(sourcemaps.init())
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 2 versions', 'ie > 8']
        }))
        .pipe(concat(distName + '.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dirs.dist))
    done()
})

gulp.task('minify-css', (done) => {
    gulp.src([dirs.lib + '/**/*.css'])
        .pipe(sourcemaps.init())
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 2 versions', 'ie > 8']
        }))
        .pipe(clean({compatibility: 'ie8'}))
        .pipe(concat(distName + '.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dirs.dist))
    done()
})

gulp.task('default', gulp.series('compile', gulp.parallel('concat-css', 'minify-css')))