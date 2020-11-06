const path = require('path');
const resolve = (dir) => path.resolve(__dirname, '../', dir);
const webpack = require('webpack');
const babelConfig = require('./babel.common.config');
const TerserPlugin = require('terser-webpack-plugin');
const distFileName = 'makeit-admin-pro';

module.exports = {
    mode: 'production',
    entry: resolve('index'),
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
                            configFile: resolve('tsconfig.dts.json'),
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.less', '.vue', '.json', '.ts', '.tsx', '.md']
    },
    externals: [
        {
            vue: {
				root: 'Vue',
				commonjs: 'vue',
				commonjs2: 'vue',
				amd: 'vue'
            },
            vuex: {
				root: 'Vuex',
				commonjs: 'vuex',
				commonjs2: 'vuex',
				amd: 'vuex'
            },
            'vue-router': {
				root: 'VueRouter',
				commonjs: 'vue-router',
				commonjs2: 'vue-router',
				amd: 'vue-router'
			},
			axios: {
				root: 'Axios',
				commonjs: 'axios',
				commonjs2: 'axios',
				amd: 'axios'
			},
			'ant-design-vue': {
				root: 'AntDesignVue',
				commonjs: 'ant-design-vue',
				commonjs2: 'ant-design-vue',
				amd: 'ant-design-vue'
			}
        }
    ],
    plugins: [
        new webpack.LoaderOptionsPlugin({
			minimize: true
		})
    ],
    optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				test: /\.min.js(\?.*)?$/i
			})
		]
	}
}