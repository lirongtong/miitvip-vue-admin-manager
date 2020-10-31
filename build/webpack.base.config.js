/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://git.makeit.vip            |
 * | Date: 2020-5-25 14:38                     |
 * +-------------------------------------------+
 */
const path = require('path');
const resolve = (dir) => path.resolve(__dirname, '../', dir);
const webpack = require('webpack');
const pkg = require('../package.json');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						css: [
							'vue-style-loader',
							{
								loader: 'css-loader',
								options: {
									sourceMap: true
								}
							}
						],
						less: [
							'vue-style-loader',
							{
								loader: 'css-loader',
								options: {
									sourceMap: true
								}
							},
							{
								loader: 'less-loader',
								options: {
									sourceMap: true
								}
							}
						]
					},
					sourceMap: true
				}
			},
			{
				test: /\.js$/,
				use: [
					'thread-loader',
					'cache-loader',
					'babel-loader'
				],
				include: [resolve('src'), resolve('example')],
				exclude: /node_modules/
			},
			{
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: resolve('tsconfig.json'),
                        },
                    },
                ],
                exclude: /node_modules/,
            },
			{
				test: /\.(le|sa|sc|c)ss$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
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
		alias: {
			'@': resolve('example'),
			'vue': 'vue/dist/vue.runtime.esm-browser.js',
			'/@src': resolve('src'),
			'@dist': resolve('dist')
		},
		extensions: ['.js', '.less', '.vue', '.json', '.ts', '.tsx', '.jsx']
	},
	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			'process.env.VERSION': `'${pkg.version}'`
		})
	]
}