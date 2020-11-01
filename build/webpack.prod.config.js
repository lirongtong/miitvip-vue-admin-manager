/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://git.makeit.vip            |
 * | Date: 2020-5-25 12:09                     |
 * +-------------------------------------------+
 */
const path = require('path')
const resolve = (dir) => path.resolve(__dirname, '../', dir)
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const compression = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const terser = require('terser-webpack-plugin')
const version = process.env.VERSION || require('../package.json').version
const banner = `makeit-admin manager v${version}
Copyright ${new Date().getFullYear()} lirongtong
All rights reserved
@license MIT`

process.env.NODE_ENV = '"production"'
process.env.MAKEIT_ADMIN_PREFIX = '"mi-"'

module.exports = merge(baseConfig, {
	mode: 'production',
	entry: {
		'makeit-admin': resolve('src/index.ts'),
		'makeit-admin.min': resolve('src/index.ts')
	},
	output: {
		path: resolve('dist'),
		publicPath: '/dist/',
		filename: '[name].js',
		library: 'MakeitAdmin',
		libraryExport: 'default',
		libraryTarget: 'umd',
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
			},
			'@ant-design': {
				root: '@ant-design',
				commonjs: '@ant-design',
				commonjs2: '@ant-design',
				amd: '@ant-design'
			}
		}
	],
	performance: {
		hints: 'warning',
        maxEntrypointSize: 51200000,
        maxAssetSize: 30000000,
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.js');
        }
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
			'process.env.MAKEIT_ADMIN_PREFIX': '"mi-"'
		}),
		new webpack.BannerPlugin({
			banner
		}),
		new CleanWebpackPlugin({
			cleanAfterEveryBuildPatterns: ['dist']
		}),
		new compression({
			test: /\.min.(js|css)$/,
			algorithm: 'gzip',
			threshold: 10240,
		})
	],
	optimization: {
		minimize: true,
		minimizer: [
			new terser({
				parallel: true,
				test: /\.min.js(\?.*)?$/i
			})
		]
	}
})
