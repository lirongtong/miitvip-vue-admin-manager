const path = require('path')
const resolve = (dir) => path.resolve(__dirname, '../', dir)
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const babelConfig = require('./babel.common.config')(false)

const entry = resolve('index')
const distFileName = 'makeit-admin-pro'

module.exports = {
    mode: 'production',
    entry: {
        [`${distFileName}`]: entry,
        [`${distFileName}.min`]: entry
    },
    output: {
        path: resolve('dist'),
        filename: distFileName + '.min.js',
        library: distFileName,
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelConfig
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: resolve('tsconfig.lib.json'),
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        })
    ],
    resolve: {
        extensions: ['.js', '.less', '.vue', '.json', '.ts', '.tsx', '.md']
    },
    externals: {
        vue: 'vue',
        vuex: 'vuex',
        'vue-router': 'vue-router',
        axios: 'axios',
        screenfull: 'screenfull',
        'ant-design-vue': 'ant-design-vue',
        '@ant-design/icons-vue': '@ant-design/icons-vue',
        'vue-types': 'vue-types',
        nprogress: 'nprogress',
        'vue-i18n': 'vue-i18n'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                test: /\.min.js(\?.*)?$/i
            })
        ]
    }
}