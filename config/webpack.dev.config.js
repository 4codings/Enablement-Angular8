const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.config.js');
const helpers = require('./helpers');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const { resolve } = require('path');


module.exports = merge(webpackBaseConfig, {
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        rules: [{
            test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
            loader: '@ngtools/webpack'
        }]
    },
    optimization: {
        noEmitOnErrors: true
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
