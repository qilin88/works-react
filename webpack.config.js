const path = require('path');
const { argv } = require('yargs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarWebpack = require('progress-bar-webpack-plugin');
const chalk  = require('chalk');
const {merge} = require('webpack-merge');

const config = require('./config/index.js');
const baseConfig = {
    entry: './src/views/index.tsx',
    output: {
        path: path.resolve(__dirname, config.publicPath), // 静态资源打包目录
        filename: '[name].[contenthash:8].chunk.js',
        assetModuleFilename: 'images/[hash][ext][query]'

    },
    devtool: "source-map",

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.(tsx| ts)?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            transpileOnly: true, //只进行语法转换, 不进行类型校验, 提高构建速度
                        }
                    }
                ],
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../src')
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)/,
                type: 'asset/resource',
                generator: {
                    publicPath: './',
                    filename: 'imgs/[name].[hash:6][ext]'
                }
            }
        ]},
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: ' react',
            template: "src/index.html",
            filename: "index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true
            },
            inject: true
        }),
        new ProgressBarWebpack(`:msg[:bar] $`),
        new MiniCssExtractPlugin()
    ],
    resolve: {
        modules: ["node_modules", "../src"],
        symlinks: false,
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias: {
            "@src": path.resolve(__dirname, '../src'),
            "@imgs": path.resolve(__dirname, '../src/assets/imgs'),
            "@styles": path.resolve(__dirname, '../src/assets/styles'),
        }
    }
}
const mode = argv.mode;
const envConfig = require(`./build/webpack.${mode}.config.js`);
module.exports = merge(baseConfig, envConfig);
