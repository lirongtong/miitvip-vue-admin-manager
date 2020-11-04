const path = require('path');
const resolve = (dir) => path.resolve(__dirname, '../', dir);
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const pkg = require('../package.json');
const postcssConfig = require('../postcss.config');
const banner = `${pkg.name} manager v${pkg.version}

Copyright ${new Date().getFullYear()} makeit.vip <lirongtong@hotmail.com>.
All rights reserved.
@license MIT`;

const entry = resolve('index');
const distFileName = 'makeit-admin';

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: {
        [`${distFileName}`]: entry,
        [`${distFileName}.min`]: entry
    },
    output: {
        path: resolve('dist/dist'),
        filename: '[name].js',
        library: distFileName,
        libraryTarget: 'umd'
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
			}
        }
    ],
    plugins: [
        new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
			'process.env.MAKEIT_ADMIN_PREFIX': '"mi-"'
		}),
		new webpack.BannerPlugin({
			banner
		}),
		new CleanWebpackPlugin(),
		new CaseSensitivePathsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new CompressionPlugin({
			test: /\.min.(js|css)$/,
			algorithm: 'gzip',
			threshold: 10240,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				test: /\.min.js(\?.*)?$/i
			})
		]
	}
});