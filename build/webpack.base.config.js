const path = require('path');
const resolve = (dir) => path.resolve(__dirname, '../', dir);
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/dist/plugin').default;
const pkg = require('../package.json');
const postcssConfig = require('../postcss.config');
const babelConfig = require('./babel.common.config');

module.exports = {
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
					loader: 'ts-loader',
					options: {
						configFile: resolve('tsconfig.json'),
						appendTsSuffixTo: [/\.vue$/]
					}
                }]
            },
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
                        options: Object.assign({}, postcssConfig, {
                            sourceMap: true
                        })
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
                        options: Object.assign({}, postcssConfig, {
                            sourceMap: true
                        })
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
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.less', '.vue', '.json', '.ts', '.tsx', '.md']
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
			'process.env.VERSION': `'${pkg.version}'`
		})
    ]
}