const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = {
    entry : __dirname + "/src/main.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.json"
                    }
                }],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/static", to: "static/" },
                { from: "src/scripts", to: "scripts/" },
                { from: "src/templates", to: "templates/" }
            ]
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "index.html"),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            }
        })
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    stats: {
        colors: true
    },
    target: "electron-main",
    devtool: "source-map"
};

module.exports = config;
