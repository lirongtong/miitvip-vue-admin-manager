const gulp = require('gulp')
const lessCli = require('less')
const path = require('path')
const ts = require('gulp-typescript')
const tsConfig = require('./typescript.config')
const tsReportDefault = ts.reporter.defaultReporter()
const LessNpmImportPlugin = require('less-plugin-npm-import')
const through2 = require('through2')
const merge2 = require('merge2')
const CleanCss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const rimraf = require('rimraf')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const babelConfig = require('./babel.common.config')
const { readFileSync } = require('fs')
const postcss = require('postcss')
const postcssConfig = require('../postcss.config')

const dirs = {
    lib: '../lib',
    es: '../es',
    src: '../src',
    dist: '../dist'
}
const distName = 'miitvip'
let lessFiles = []

const renderLess = async (data, file) => {
    return lessCli.render(data, {
        paths: [path.dirname(file)],
        filename: file,
        plugins: [new LessNpmImportPlugin({ prefix: '~' })],
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

const parseLessPath = (str, file) => {
    str = str.replace(/\@import (\'|\")/ig, '').replace(/(\'|\");/ig, '')
    const startStr = str.substring(0, 2)
    const startStrMatches = startStr.match(/(\.\/|\.\.|\.\\)/)
    return (startStrMatches && startStrMatches.length > 0)
        ? path.resolve(path.dirname(file), str)
        : str
}

const convertLess = async (lessFile) => {
    const resolvedLessFile = path.resolve(process.cwd(), lessFile)
    let data = readFileSync(resolvedLessFile, 'utf-8')
    data = data.replace(/^\uFEFF/, '')
    return renderLess(data, resolvedLessFile)
}

const duplicationMergeLess = (lessFile, includeAntdv = false) => {
    const resolvedLessFile = path.resolve(process.cwd(), lessFile)
    let data = readFileSync(resolvedLessFile, 'utf-8')
    data = data.replace(/^\uFEFF/, '')
    const imports = data.match(/\@import(.+)\;/ig)
    if (imports && imports.length > 0) {
        for (let i = 0, l = imports.length; i < l; i++) {
            const key = parseLessPath(imports[i], resolvedLessFile)
            if (!includeAntdv) {
                if (key.indexOf('ant-design-vue') !== -1) {
                    data = data.replace(imports[i], '')
                }
            }
            if (!lessFiles.includes(key)) {
                lessFiles.push(key)
            } else {
                const variables = key.match(/(\/variables\.less|\\variables\.less|\/theme\/|\\theme\\)/ig)
                if (!variables || variables.length <= 0) data = data.replace(imports[i], '')
            }
        }
    }
    return renderLess(data, resolvedLessFile)
}

const compileLess = (library, sources) => {
    sources = sources ? sources : [
        dirs.src + '/**/*.less',
        dirs.src + '/**/**/*.less'
    ]
    return gulp.src(sources)
        .pipe(
            through2.obj(function (file, _encoding, callback) {
                this.push(file.clone())
                if (library === false && !lessFiles.includes(file.path)) lessFiles.push(file.path)
                convertLess(file.path)
                    .then(css => {
                        file.contents = Buffer.from(css)
                        file.path = file.path.replace(/\.less$/, '.css')
                        this.push(file)
                        callback()
                    })
                    .catch(e => {
                        console.error(e)
                    })
            })
        )
        .pipe(gulp.dest(library === false ? dirs.es : dirs.lib))
}

const babelify = (js, library) => {
    const config = babelConfig(library)
    config.babelrc = false
    delete config.cacheDirectory
    return js.pipe(babel(config))
        .pipe(
            through2.obj(function (file, encoding, callback) {
                this.push(file.clone())
                if (
                    file.path.match(/\/style\/index\.(js|jsx|ts|tsx)$/) ||
                    file.path.match(/\\style\\index\.(js|jsx|ts|tsx)$/)
                ) {
                    let content = file.contents.toString(encoding)
                    if (library === false) {
                        content = content.replace(/\/style\/?'/g, "/style/css'").replace(/\.less/g, '.css')
                    } else {
                        content = content.replace(/\/es\//g, '/lib/').replace(/\/style\/?\"/g, '/style/css"').replace(/\.less/g, '.css')
                    }
                    file.contents = Buffer.from(content)
                    file.path = file.path.replace(/index\.(js|jsx|ts|tsx)$/, 'mi.js')
                    this.push(file)
                    callback()
                } else callback()
            })
        )
        .pipe(gulp.dest(library === false ? dirs.es : dirs.lib))
}

const compile = (library) => {
    rimraf.sync(library === false ? dirs.es : dirs.lib)
    const lessStream = compileLess(library)
    let error = 0
    const sources = [
        dirs.src + '/**/*.js',
        dirs.src + '/**/*.jsx',
        dirs.src + '/**/*.ts',
        dirs.src + '/**/*.tsx',
        'types/**/*.d.ts'
    ]
    const tsResult = gulp.src(sources)
        .pipe(ts(tsConfig(library), {
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
    const tsFileStream = babelify(tsResult.js, library)
    const tsd = tsResult.dts.pipe(gulp.dest(library === false ? dirs.es : dirs.lib))
    return merge2([lessStream, tsFileStream, tsd])
}

gulp.task('compile-less-in-ts-into-es', gulp.series(done => {
    compile(false).on('finish', () => done())
}))

gulp.task('compile-less-in-ts', gulp.series('compile-less-in-ts-into-es', done => {
    compile().on('finish', () => done())
}))

gulp.task('duplicate-concat-less-to-css', gulp.series(done => {
    const concatCss = gulp.src([
        dirs.src + '/**/*.less',
        dirs.src + '/**/**/*.less'
    ])
        .pipe(
            through2.obj(function (file, _encoding, callback) {
                duplicationMergeLess(file.path, true)
                    .then(css => {
                        file.contents = Buffer.from(css)
                        this.push(file)
                        callback()
                    })
                    .catch(e => {
                        console.error(e)
                    })
            })
        )
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', 'ie > 8'],
            cascade: true
        }))
        .pipe(concat(distName + '.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dirs.dist))
    concatCss.on('finish', () => {
        lessFiles = []
        done()
    })
}))

gulp.task('duplicate-concat-less-to-custom-css', gulp.series('duplicate-concat-less-to-css', done => {
    const concatCss = gulp.src([
        dirs.src + '/**/*.less',
        dirs.src + '/**/**/*.less'
    ])
        .pipe(
            through2.obj(function (file, _encoding, callback) {
                duplicationMergeLess(file.path)
                    .then(css => {
                        file.contents = Buffer.from(css)
                        this.push(file)
                        callback()
                    })
                    .catch(e => {
                        console.error(e)
                    })
            })
        )
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', 'ie > 8'],
            cascade: true
        }))
        .pipe(concat(distName + '-custom.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dirs.dist))
    concatCss.on('finish', () => done())
}))

gulp.task('minify-css', gulp.series('duplicate-concat-less-to-custom-css', done => {
    gulp.src([
        dirs.dist + '/' + distName + '.css',
        dirs.dist + '/' + distName + '-custom.css'
    ])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', 'ie > 8']
        }))
        .pipe(CleanCss({
            compatibility: 'ie8',
            level: 2
        }))
        .pipe(concat(distName + '.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dirs.dist))
    done()
}))

gulp.task('default', gulp.series('compile-less-in-ts', 'minify-css'))