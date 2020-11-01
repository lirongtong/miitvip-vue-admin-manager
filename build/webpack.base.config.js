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
const VueLoaderPlugin = require('vue-loader/dist/plugin').default;

module.exports = {
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
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
					'less-loader',
					'sass-loader'
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
			'makeit-admin': path.join(__dirname, './components'),
			'makeit-admin/styles': path.join(__dirname, './styles'),
			'vue$': 'vue/dist/vue.esm-bundler.js',
			'/@src': resolve('src')
		},
		extensions: ['.js', '.less', '.vue', '.json', '.ts', '.tsx', '.jsx', '.md']
	},
	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			'process.env.VERSION': `'${pkg.version}'`
		})
	]
}