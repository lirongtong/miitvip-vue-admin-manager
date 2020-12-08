const path = require('path');
const resolve = (dir) => path.resolve(__dirname, '../', dir);
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/dist/plugin').default;
const pkg = require('../package.json');
const postcssConfig = require('../postcss.config');
const postcssOptions = Object.assign({}, postcssConfig, {
    sourceMap: true
})
const babelConfig = require('./babel.common.config')(false);

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
                                            configFile: resolve('tsconfig.json'),
                                            appendTsSuffixTo: [/\.vue$/]
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
                            configFile: resolve('tsconfig.json'),
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
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
                    }
                ]
            },
            {
                test: /\.less$/,
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
    performance: {hints: false},
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
			'process.env.VERSION': `'${pkg.version}'`
		})
    ]
}