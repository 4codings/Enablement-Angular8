const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('./helpers');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { IndexHtmlWebpackPlugin } = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin');
const { resolve } = require('path');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {

    entry: {
        vendor: './src/vendor.ts',
        main: './src/main.ts',
        polyfills: './src/polyfills.ts',
        styles: './src/styles.scss'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
                test: [/.js$|.ts$/],
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/typescript']
                    }
                }
            },

            {
                test: [/.js$/],
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                loader: 'file-loader',
                options: {
                    name: `assets/[name].[hash].[ext]`,
                    limit: 10000
                }
            },
            {
                test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                loader: 'url-loader',
                options: {
                    name: `assets/[name].[hash].[ext]`,
                    limit: 10000
                }
            },
            {
                test: /\.(css|scss)$/,
                use: ['to-string-loader', 'css-loader', 'sass-loader'],
                exclude: [resolve('./src/styles.scss')]
            },
            {
                test: /\.(css|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                include: [resolve('./src/styles.scss')]
            },
            {
                test: /[\/\\]@angular[\/\\].+\.js$/,
                parser: { system: true }
            }
        ]
    },

    plugins: [

        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),

        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src'), {}
        ),
        new IndexHtmlWebpackPlugin({
            input: resolve('./src/index.html'),
            output: 'index.html',
            entrypoints: [
                'styles',
                'polyfills',
                'main',
                'vendor'
            ]
        }),
        new CopyWebpackPlugin([{
                from: 'src/assets',
                to: 'assets'
            },
            {
                from: 'src/favicon.ico'
            }
        ]),
        new CleanWebpackPlugin()
    ]
};
