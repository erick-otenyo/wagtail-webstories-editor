const webpack = require("webpack");
const path = require("path");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = function (env, argv) {
    const options = {mode: argv.mode};
    const isDevBuild = options.mode === "development";

    return {
        mode: options.mode,
        entry: {
            editor: path.resolve(__dirname, "./src/editor.js"),
            dashboard: path.resolve(__dirname, "./src/dashboard.js"),
        },
        resolve: {
            extensions: [".js", ".css", ".scss", ".svg"],
            fallback: {url: require.resolve("url/"), module: false},
        },
        optimization: {
            minimize: !isDevBuild,
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: "defaults",
                                        debug: true,
                                        useBuiltIns: "usage",
                                        corejs: 3,
                                    },
                                ],
                                ["@babel/preset-react", {runtime: "automatic"}],
                            ],
                        },
                    },
                },
                {
                    test: /\.(svg|png)$/,
                    use: {
                        loader: "url-loader",
                        options: {},
                    },
                },
            ],
        },
        output: {
            path: path.join(__dirname, "../wagtail_webstories_editor/static/wagtail_webstories_editor/js/story-editor"),
            filename: "[name].js",
            library: "WebStories",
            libraryTarget: "umd",
            umdNamedDefine: true,
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.ENVIRONMENT": JSON.stringify(options.mode),
                // "process.env.VERSION": JSON.stringify(packageJson.version),
            }),
            new WorkboxWebpackPlugin.InjectManifest({
                swSrc: "./src/src-sw.js",
                swDest: "sw.js",
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
            })
        ],
    }
        ;
};
