const path = require("path");
const fs  = require('fs');

const lessToJs = require('less-vars-to-js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, '../src/styles/ant-vars.less'), 'utf8'));

const {
    devServer,
    Env,
    stats,
} = require("./constants");
const getPluginsByEnv = require("./plugins");

module.exports = ({ analyze, env } = {}) => ({
    devtool: env !== Env.PRODUCTION && "source-map",
    devServer: {
        contentBase: path.join(__dirname, "../", "dist"),
        disableHostCheck: true,
        host: devServer.host,
        port: devServer.port,
        publicPath: `${devServer.host}:${devServer.port}:/${devServer.path}/`,
        stats,
    },
    entry: {
        app: "./src/index.tsx"
    },
    mode: env === Env.PRODUCTION ? "production" : "development",
    module: {
        rules: [
            {
                test: /\.(j|t)sx?/,
                include: [
                    path.resolve(__dirname, "../", "src")
                ],
                exclude: /node_modules/,
                use: [
                    { loader: "babel-loader" },
                ],
            },

            // this rule processes any CSS written for this project and contained in src/
            // it applies PostCSS plugins and converts it to CSS Modules
            {
                test: /\.css/,
                include: [
                    path.resolve(__dirname, "../", "src")
                ],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            camelCase: true,
                            importLoaders: 1,
                            localIdentName: "[name]__[local]--[hash:base64:5]",
                            modules: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [
                                require("postcss-flexbugs-fixes"),
                                require("postcss-preset-env")({
                                    autoprefixer: {
                                        flexbox: "no-2009",
                                    },
                                }),
                            ],
                            sourceMap: env !== Env.PRODUCTION,
                        }
                    },
                ],
            },

            // this rule will handle any css imports out of node_modules; it does not apply PostCSS,
            // nor does it convert the imported css to CSS Modules
            // e.g., importing antd component css
            {
                test: /\.css/,
                include: [
                    path.resolve(__dirname, "../", "node_modules")
                ],
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader" },
                ],
            },
            {
                test: /\.less$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        {
                            loader: "css-loader",
                            options: {
                                camelCase: true,
                                importLoaders: 1
                            }

                        },
                        {
                            loader: "less-loader",
                            options: {
                                javascriptEnabled: true,
                                modifyVars: themeVariables,

                            }
                        }
                    ]
            },
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    filename: 'vendor.[contenthash].js',
                    test: /[\\/]node_modules[\\/]/,
                },
            }
        }
    },
    output: {
        path: path.resolve(__dirname, "../", "dist"),
        filename: "[name].[chunkhash].js"
    },
    plugins: getPluginsByEnv(env, analyze),
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    stats: analyze ? "none" : stats,
});
