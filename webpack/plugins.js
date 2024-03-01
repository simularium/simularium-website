require("dotenv").config();
const path = require("path");

const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require("webpack");

const Env = require("./constants").Env;

const getBasePlugins = (dist, env) => {
    return [
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, "../", "tsconfig.json"),
            },
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "style.[contenthash].css",
        }),
        new HtmlWebpackPlugin({
            favicon: "./src/assets/AICS-logo.svg",
            template: path.resolve(__dirname, "index.template.html"),
            meta: {
                viewport: "width=device-width, initial-scale=1",
                description:
                    "The Simularium Viewer makes it easy to share and interrogate interactive 3D visualizations of biological simulation trajectories and related plots directly in a web browser.",
                ["og:title"]: "Simularium",
                ["og:description"]:
                    "The Simularium Viewer makes it easy to share and interrogate interactive 3D visualizations of biological simulation trajectories and related plots directly in a web browser.",
                ["og:url"]: "https://simularium.allencell.org",
                ["og:type"]: "website",
                ["og:image:type"]: "image/png",
                ["og:image:width"]: "2048",
                ["og:image:height"]: "1115",
                ["og:image:alt"]:
                    "A view of the Simularium viewer showing a 3D scene of molecular interactions, with data plots on the right side of the screen, and a menu of the visible agents on the left side.",
                ["twitter:card"]: "summary_large_image",
                ["twitter:title"]: "Simularium",
                ["twitter:description"]:
                    "The Simularium Viewer makes it easy to share and interrogate interactive 3D visualizations of biological simulation trajectories and related plots directly in a web browser.",
                ["twitter:url"]: "https://simularium.allencell.org/",
            },
        }),
        new webpack.EnvironmentPlugin({
            GH_BUILD: !!process.env.GH_BUILD,
            GOOGLE_API_KEY:
                process.env.GOOGLE_API_KEY ||
                "AIzaSyAZ3ow-AhfTcOsBml7e3oXZ7JwqIATcGwU",
        }),
        new webpack.DefinePlugin({
            SIMULARIUM_WEBSITE_VERSION: JSON.stringify(
                require("../package.json").version
            ),
            SIMULARIUM_VIEWER_VERSION: JSON.stringify(
                require("../node_modules/@aics/simularium-viewer/package.json")
                    .version
            ),
            SIMULARIUM_BUILD_ENVIRONMENT: JSON.stringify(env),
        }),
    ];
};

const BUNDLE_ANALYZER = [
    new BundleAnalyzerPlugin({
        analyzerMode: "static",
    }),
];

const PLUGINS_BY_ENV = {
    [Env.PRODUCTION]: [
        new webpack.EnvironmentPlugin({
            BACKEND_SERVER_IP: `production-node1-agentviz-backend.cellexplore.net`,
        }),
    ],
    [Env.STAGE]: [
        new webpack.EnvironmentPlugin({
            BACKEND_SERVER_IP: `staging-node1-agentviz-backend.cellexplore.net`,
        }),
    ],
    [Env.DEVELOPMENT]: [
        new webpack.EnvironmentPlugin({
            // FIXME: make a dev server
            BACKEND_SERVER_IP: `staging-node1-agentviz-backend.cellexplore.net`,
        }),
    ],
};

module.exports = (env, dist, analyzer) => [
    ...getBasePlugins(dist, env),
    ...(analyzer ? BUNDLE_ANALYZER : []),
    ...(PLUGINS_BY_ENV[env] || []),
];
