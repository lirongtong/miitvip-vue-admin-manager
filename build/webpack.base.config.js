const path = require('path')
const resolve = (dir) => path.resolve(__dirname, '../', dir)
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/dist/plugin').default
const package = require(resolve('package.json'))
const postcssConfig = require(resolve('postcss.config'))
const postcssOptions = Object.assign({}, postcssConfig, {
    sourceMap: true
})
const babelConfig = require('./babel.common.config')(false)

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                ts: [
                                    {
                                        loader: 'ts-loader',
                                        options: {
                                            appendTsSuffixTo: [/\.vue$/],
                                            configFile: resolve('tsconfig.json'),
                                            compilerOptions: {
                                                declaration: false,
                                                declarationDir: undefined
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: babelConfig
            },
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
                            appendTsSuffixTo: [/\.vue$/],
                            configFile: resolve('tsconfig.json'),
                            compilerOptions: {
                                declaration: false,
                                declarationDir: undefined
                            }
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: postcssOptions
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                sourceMap: true,
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(gif|jpg|png|webp|woff|woff2|svg|eot|ttf)\??.*$/,
                loader: 'url-loader'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
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
    performance: { hints: false },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env.VERSION': `'${package.version}'`
        })
    ]
}