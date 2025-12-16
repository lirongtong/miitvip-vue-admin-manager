import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import esbuild from '@rollup/plugin-esbuild'
import path from 'path'
import { createRequire } from 'module'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { visualizer } from 'rollup-plugin-visualizer'
import postcss from 'rollup-plugin-postcss'
import { externalPackages } from './rollup.external.mjs'
import strip from '@rollup/plugin-strip'

const requireRes = createRequire(import.meta.url)
const pkg = requireRes('../package.json')
const styleInject = path
    .resolve(process.cwd(), './node_modules/style-inject/dist/style-inject.es.js')
    .replace(/\\|\\\\/g, '/')

const banner = `/**
 * ${pkg.name} v${pkg.version}
 *
 * Copyright 2020 - ${new Date().getFullYear()} makeit.vip <makeit@makeit.vip>.
 * All rights reserved.
 * @license MIT
 * 
 * follow me on Github! https://github.com/lirongtong
 **/`

// Babel 仅用于处理 Vue JSX，其他转译由 esbuild 完成
const babelOptions = {
    extensions: ['.jsx', '.tsx'],
    plugins: [
        ['@vue/babel-plugin-jsx', { isCustomElement: (tag) => tag.startsWith('swiper-') }]
    ],
    exclude: /[\/]node_modules[\/]/,
    babelHelpers: 'bundled'
}

const analyze = process.env.MI_ROLLUP_ANALYZE === '1'

const plugins = [
    typescript({
        tsconfig: path.resolve(process.cwd(), './tsconfig.json'),
        cacheRoot: path.resolve(process.cwd(), './node_modules/.rpt2_cache_esm')
    }),
    nodeResolve({ browser: true, jsnext: true }),
    json(),
    strip(),
    // esbuild 处理 TS/JS 转译，速度比 Babel 快 10-100 倍
    esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        sourceMap: true,
        target: 'es2015',
        loaders: {
            '.js': 'js',
            '.ts': 'ts'
        }
    }),
    // Babel 仅处理 Vue JSX 语法
    babel(babelOptions),
    commonjs(),
    postcss({
        modules: { generateScopedName: 'mi-[name]-[hash:base64:8]', localsConvention: 'camelCase' },
        minimize: true
    }),
    {
        name: 'custom-plugin-replace-style-inject',
        generateBundle: (_options, bundle) => {
            Object.entries(bundle).forEach((entry) => {
                if (!entry[0].match(/.*less.js$/)) return
                bundle[entry[0]].code = entry[1].code.replace(styleInject, 'style-inject')
            })
        }
    },
    analyze ? visualizer() : null
].filter(Boolean)

// 缓存实例，用于加速增量构建
let cache

const config = defineConfig([
    {
        input: path.resolve(process.cwd(), './src/index.ts'),
        output: [
            {
                dir: 'lib',
                format: 'cjs',
                preserveModules: true,
                exports: 'named',
                banner,
                sourcemap: true,
                preserveModulesRoot: './src'
            },
            {
                dir: 'es',
                format: 'esm',
                preserveModules: true,
                exports: 'named',
                banner,
                sourcemap: true,
                preserveModulesRoot: './src'
            }
        ],
        external: [...externalPackages],
        plugins,
        // 启用 Rollup 缓存
        cache,
        onwarn(warning) {
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && warning.exporter === 'vue') return
        }
    }
])

export default config
