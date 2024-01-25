import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import path from 'path'
import { createRequire } from 'module'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import builtins from 'builtin-modules'

const requireRes = createRequire(import.meta.url)
const pkg = requireRes('../package.json')
const fileName = 'makeit-admin-pro'

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
Object.entries(dependencies).forEach(([_key, value]) => globalDependencies[value] = value)

const externalGlobals = Object.assign(globalDependencies, { 'style-inject': 'styleInject' })
const externalPackages = [
    ...dependencies,
    ...builtins
]

const plugins = [nodeResolve({ browser: true, jsnext: true }), json(), babel(babelOptions), commonjs(), terser()]

const config = defineConfig([
    {
        input: path.resolve(process.cwd(), './src/index.ts'),
        output: [
            {
                name: fileName,
                file: `dist/${fileName}.min.js`,
                format: 'umd',
                exports: 'named',
                globals: externalGlobals
            }
        ],
        external: externalPackages,
        plugins: [
            typescript({ tsconfig: path.resolve(process.cwd(), './tsconfig.umd.json') }),
            ...plugins,
            postcss({
                modules: { generateScopedName: 'mi-[name]-[hash:base64:8]', localsConvention: 'camelCase' },
                plugins: [autoprefixer()],
                minimize: true,
                sourcemap: true,
                extract: `${fileName}.min.css`
            })
        ],
        onwarn(warning) {
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && warning.exporter === 'vue') return
        }
    }
])

export default config
