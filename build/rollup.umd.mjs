import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import gzip from 'rollup-plugin-gzip'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import esbuild from 'rollup-plugin-esbuild'
import path from 'path'
import filesize from 'rollup-plugin-filesize'
import { createRequire } from 'module'
import { visualizer } from 'rollup-plugin-visualizer'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import { externalPackages, externalGlobals } from './rollup.external.mjs'
import strip from '@rollup/plugin-strip'

const requireRes = createRequire(import.meta.url)
const pkg = requireRes('../package.json')
const fileName = 'makeit-admin-pro'

const banner = `/**
 * ${pkg.name} v${pkg.version}
 *
 * Copyright 2020 - ${new Date().getFullYear()} makeit.vip <makeit@makeit.vip>.
 * All rights reserved.
 * @license MIT
 * 
 * follow me on Github! https://github.com/lirongtong
 **/`

// Babel 处理 JSX/TSX 文件（包括 Vue JSX 语法和 ES6+ 转译）
const babelOptions = {
    extensions: ['.jsx', '.tsx'],
    presets: [
        ['@babel/preset-env', { modules: false }]
    ],
    plugins: [
        ['@vue/babel-plugin-jsx', { isCustomElement: (tag) => tag.startsWith('swiper-') }]
    ],
    exclude: /[\/]node_modules[\/]/,
    babelHelpers: 'bundled'
}

const analyze = process.env.MI_ROLLUP_ANALYZE === '1'

const plugins = [
    typescript({
        tsconfig: path.resolve(process.cwd(), './tsconfig.umd.json'),
        cacheRoot: path.resolve(process.cwd(), './node_modules/.rpt2_cache_umd')
    }),
    nodeResolve({ browser: true, jsnext: true }),
    json(),
    strip(),
    // esbuild 处理 .js 和 .ts 文件转译（不含 JSX），速度比 Babel 快 10-100 倍
    esbuild({
        include: /\.[jt]s$/,
        exclude: /node_modules/,
        sourceMap: true,
        target: 'es2015',
        loaders: {
            '.js': 'js',
            '.ts': 'ts'
        }
    }),
    // Babel 处理 .jsx 和 .tsx（Vue JSX 语法）
    babel(babelOptions),
    commonjs(),
    postcss({
        modules: { generateScopedName: 'mi-[name]-[hash:base64:8]', localsConvention: 'camelCase' },
        plugins: [autoprefixer()],
        minimize: true,
        extract: `${fileName}.min.css`,
        sourceMap: true
    }),
    gzip(),
    analyze ? visualizer() : null,
    filesize()
].filter(Boolean)

// 缓存实例，用于加速增量构建
let cache

const config = defineConfig([
    {
        input: path.resolve(process.cwd(), './src/index.ts'),
        output: [
            {
                name: fileName,
                file: `dist/${fileName}.js`,
                format: 'umd',
                exports: 'named',
                banner,
                sourcemap: true,
                globals: externalGlobals
            },
            {
                name: fileName,
                file: `dist/${fileName}.min.js`,
                format: 'umd',
                exports: 'named',
                banner,
                sourcemap: true,
                globals: externalGlobals,
                plugins: [terser()]
            }
        ],
        external: externalPackages,
        plugins,
        // 启用 Rollup 缓存
        cache,
        onwarn(warning) {
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && warning.exporter === 'vue') return
        }
    }
])

export default config
