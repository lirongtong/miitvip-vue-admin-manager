import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import path from 'path'
import { createRequire } from 'module'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { visualizer } from 'rollup-plugin-visualizer'
import postcss from 'rollup-plugin-postcss'
import builtins from 'builtin-modules'
import { rimraf } from 'rimraf'
import strip from '@rollup/plugin-strip'

const requireRes = createRequire(import.meta.url)
const pkg = requireRes('../package.json')
const fileName = 'makeit-admin-pro'
const styleInject = path
    .resolve(process.cwd(), './node_modules/style-inject/dist/style-inject.es.js')
    .replace(/\\|\\\\/g, '/')

rimraf(`../dist/${fileName}.min.js`)

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
        '@vue/babel-plugin-jsx',
        '@babel/plugin-transform-object-assign'
    ],
    exclude: /[\\/]node_modules[\\/]/,
    babelHelpers: 'runtime'
}

const dependencies = Object.keys(pkg.dependencies || {})
const globalDependencies = {}
Object.entries(dependencies).forEach(([key, value]) => globalDependencies[value] = value)

const externalPackages = [
    ...dependencies,
    ...builtins
]

const plugins = [
    typescript({ tsconfig: path.resolve(process.cwd(), './tsconfig.json') }),
    nodeResolve({ browser: true }),
    json(),
    strip(),
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
    visualizer()
]

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
                preserveModulesRoot: './src'
            },
            {
                dir: 'es',
                format: 'esm',
                preserveModules: true,
                exports: 'named',
                banner,
                preserveModulesRoot: './src'
            }
        ],
        external: [...externalPackages, /@babel\/runtime/, /style-inject/],
        plugins,
        onwarn(warning) {
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && warning.exporter === 'vue') return
        }
    }
])

export default config
