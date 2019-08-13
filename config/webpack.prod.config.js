const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.config.js');
const helpers = require('./helpers');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const { resolve } = require('path');


const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = merge(webpackBaseConfig, {
    devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    module: {
        rules: [{
            test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
            loader: '@ngtools/webpack'
        }]
    },

    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single',
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),

            new OptimizeCSSAssetsPlugin({
                cssProcessor: cssnano,
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: false
            })
        ]
    },

    plugins: [
        new AngularCompilerPlugin({
            mainPath: resolve('./src/main.ts'),
            sourceMap: true,
            nameLazyFiles: false,
            tsConfigPath: resolve('./src/tsconfig.app.json'),
            skipCodeGeneration: true,
            hostReplacementPaths: {
                [resolve('src/environments/environment.ts')]: resolve('src/environments/environment.prod.ts')
            }
        })
    ]
});
