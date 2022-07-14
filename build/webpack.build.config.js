const path = require('path')
const resolve = (dir) => path.resolve(__dirname, '../', dir)
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const baseConfig = require('./webpack.base.config')
const package = require(resolve('package.json'))
const banner = `${package.name} ${package.version}

Copyright 2020 - ${new Date().getFullYear()} makeit.vip <makeit@makeit.vip>.
All rights reserved.
@license MIT`

const entry = resolve('index')
const distFileName = 'miitvip'

module.exports = merge(baseConfig, {
    devtool: 'source-map',
    mode: 'production',
    entry: {
        [`${distFileName}`]: entry,
        [`${distFileName}.min`]: entry
    },
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        library: distFileName,
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
			'process.env.MAKEIT_ADMIN_RPO_PREFIX': '"mi-"'
		}),
		new webpack.BannerPlugin({
			banner
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		}),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['dist']
		}),
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
			}),
			new CssMinimizerPlugin({
                parallel: true,
				test: /\.min\.css$/i
			})
        ]
    }
})