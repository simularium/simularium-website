require('dotenv').config()
const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require('webpack');

const Env = require('./constants').Env;

const getBasePlugins = (dist, env) => {
    console.log(dist, env)
    return [new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve(__dirname, '../', 'tsconfig.json'),
            workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
        }),
        new CleanWebpackPlugin([dist], {
            root: path.resolve(__dirname, '../'),
            watch: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            favicon: './src/assets/AICS-logo.svg',
            template: path.resolve(__dirname, 'index.template.html')
        }),
        new webpack.EnvironmentPlugin({
            GH_BUILD: !!process.env.GH_BUILD,
            GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "AIzaSyAZ3ow-AhfTcOsBml7e3oXZ7JwqIATcGwU"
        }),
    ]
}

const BUNDLE_ANALYZER = [new BundleAnalyzerPlugin({
    analyzerMode: 'static'
})];

const PLUGINS_BY_ENV = {
    [Env.PRODUCTION]: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.ids.HashedModuleIdsPlugin(),
        new webpack.EnvironmentPlugin({
            BACKEND_SERVER_IP: `production-node1-agentviz-backend.cellexplore.net`
        })
    ],
    [Env.STAGE]: [
        new webpack.EnvironmentPlugin({
            BACKEND_SERVER_IP: `staging-node1-agentviz-backend.cellexplore.net`
        })
    ],
    [Env.DEVELOPMENT]: [
        new webpack.EnvironmentPlugin({
            // FIXME: make a dev server
            BACKEND_SERVER_IP: `staging-node1-agentviz-backend.cellexplore.net`
        })
    ]
};

module.exports = (env, dist, analyzer) => [
    ...getBasePlugins(dist, env),
    ...(analyzer ? BUNDLE_ANALYZER : []),
    ...(PLUGINS_BY_ENV[env] || [])
];