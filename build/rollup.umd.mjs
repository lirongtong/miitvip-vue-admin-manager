import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import gzip from 'rollup-plugin-gzip'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import path from 'path'
import filesize from 'rollup-plugin-filesize'
import { createRequire } from 'module'
import { DEFAULT_EXTENSIONS } from '@babel/core'
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

const babelOptions = {
    presets: [['@babel/preset-env', { modules: false }]],
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    plugins: [
        ['@babel/plugin-transform-runtime', { corejs: 3 }],
        ['@vue/babel-plugin-jsx', { isCustomElement: (tag) => tag.startsWith('swiper-') }],
        '@babel/plugin-transform-object-assign'
    ],
    exclude: /[\\/]node_modules[\\/]/,
    babelHelpers: 'runtime'
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
        onwarn(warning) {
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && warning.exporter === 'vue') return
        }
    }
])

export default config
