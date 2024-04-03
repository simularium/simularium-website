const path = require("path");
const fs = require("fs");

const lessToJs = require("less-vars-to-js");
const themeVariables = lessToJs(
    fs.readFileSync(path.join(__dirname, "../src/styles/ant-vars.less"), "utf8")
);
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { devServer, Env, stats } = require("./constants");
const getPluginsByEnv = require("./plugins");

module.exports = ({ analyze, env, dest = "dist" } = {}) => ({
    devtool: env !== Env.PRODUCTION && "source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "../", dest),
            publicPath: "/",
        },
        allowedHosts: "all",
        host: devServer.host,
        port: devServer.port,
        historyApiFallback: true,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
    },
    entry: {
        app: "./src/index.tsx",
    },
    mode:
        env === Env.PRODUCTION || env === Env.STAGE
            ? "production"
            : "development",
    module: {
        rules: [
            {
                test: /\.(j|t)sx?/,
                include: [path.resolve(__dirname, "../", "src")],
                exclude: /node_modules/,
                use: [{ loader: "babel-loader" }],
            },

            // this rule processes any CSS written for this project and contained in src/
            // it applies PostCSS plugins and converts it to CSS Modules
            {
                test: /\.css/,
                include: [
                    path.resolve(__dirname, "../", "src/components"),
                    path.resolve(__dirname, "../", "src/containers"),
                ],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                exportLocalsConvention: "camelCase",
                                localIdentName:
                                    "[name]__[local]--[hash:base64:5]",
                            },
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                ident: "postcss",
                                plugins: [
                                    require("postcss-flexbugs-fixes"),
                                    require("postcss-preset-env")({
                                        autoprefixer: {
                                            flexbox: "no-2009",
                                        },
                                    }),
                                ],
                            },
                            sourceMap: env !== Env.PRODUCTION,
                        },
                    },
                ],
            },

            // this rule will handle any css imports out of node_modules; it does not apply PostCSS,
            // nor does it convert the imported css to CSS Modules
            // e.g., importing antd component css
            {
                test: /\.css/,
                include: [
                    path.resolve(__dirname, "../src", "style.css"),
                    path.resolve(__dirname, "../", "node_modules"),
                    path.resolve(__dirname, "../", "../simularium-viewer"),
                ],
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: themeVariables,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(eot|woff|woff2)([\?]?.*)$/,
                include: [path.resolve(__dirname, "../src/assets/fonts")],
                type: "asset/inline",
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: ["file-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                        esModule: false,
                },
            },
            {
                test: /\.md$/,
                use: ["raw-loader"],
            },
        ],
    },
    optimization: {
        moduleIds:
            env === Env.STAGE || env === Env.PRODUCTION ? "named" : undefined,
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    filename: "vendor.[contenthash].js",
                    test: /[\\/]node_modules[\\/]/,
                },
            },
        },
    },
    output: {
        path: path.resolve(__dirname, "../", dest),
        filename: "[name].[chunkhash].js",
        publicPath: process.env.GH_BUILD ? "" : "/",
    },
    plugins: getPluginsByEnv(env, dest, analyze),
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
    stats: analyze ? "none" : stats,
});
