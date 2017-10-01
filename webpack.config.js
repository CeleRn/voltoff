'use strict';

// Зависимости
const webpack = require("webpack");
const path = require('path');
const yml = require("require-yml");

// Конфиг Hexo
const hexoConfig = yml("./_config.yml");
console.dir(hexoConfig.theme);
// Переменные
const NODE_ENV = process.env.NODE_ENV || 'development';

// Webpack plugins
const extractCSS = require("extract-text-webpack-plugin");
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

// Настройка для SVGO-loader
let svgoConfig = JSON.stringify({
    plugins: [{
        removeTitle: true
    }, {
        convertColors: {
            shorthex: false
        }
    }, {
        convertPathData: true
    }]
});


module.exports = {
    context: path.join(__dirname, "themes", hexoConfig.theme, "assets"),

    entry: {
        commons: './commons'
    },

    output: {
        path: path.join(__dirname, "public"),
        publicPath: '/',
        filename: 'assets/js/[name].js'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', ".json"]
    },
    resolveLoader: {
        modules: ["node_modules"],
        extensions: [".js", ".json"],
        mainFields: ["loader", "main"],
        moduleExtensions: ['-loader']
    },
    target: 'web',
    module: {
        // configuration regarding modules

        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            { // Javascript
                test: /\.js$/,
                include: [
                    path.join(__dirname, "themes", hexoConfig.theme, "assets"),
                    path.join(__dirname, "node_modules", "svg-sprite-loader", "lib", "plugin.js")
                ],
                use: "babel?presets[]=es2015"
            }, { // SCSS в файлы
                test: /\.(sass|scss)$/,
                use: extractCSS.extract('css!sass')
            }, { // CSS в файлы 
                test: /\.(css)$/,
                use: extractCSS.extract('css')
            },

            { // Картинки 
                test: /\.(png|jpg|svg|gif)$/,
                exclude: path.join(__dirname, "themes", hexoConfig.theme, "assets", "icons"),
                use: 'file?name=assets/images/[name].[ext]'
            }, { // Копируем шрифты
                test: /\.(ttf|eot|woff|woff2)$/,
                use: 'file?name=assets/fonts/[path][name].[ext]'
            }, {
                test: /\.svg$/,
                include: path.join(__dirname, "themes", hexoConfig.theme, "assets", "icons"),
                use: [

                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'assets/icons/icons-sprite.svg'
                        }

                    }, {
                        loader: 'svgo-loader?' + svgoConfig
                    }
                ]
            }

        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new extractCSS({
            filename: 'assets/css/[name].css',
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            // In case you imported plugins individually, you must also require them here:
            Util: "exports-loader?Util!bootstrap/js/dist/util",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
            Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
            Button: "exports-loader?Button!bootstrap/js/dist/button",
            Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
            Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
            Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
            Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
            Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
            Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip"
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "commons",
        //     minChunks: 2
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new SpriteLoaderPlugin()
    ],
    // watch: NODE_ENV == 'development',

    // watchOptions: {
    //     aggregateTimeout: 100
    // },
    // devServer: {
    //     contentBase: path.join(__dirname, "public", hexoConfig.theme, "assets")
    //     // hot: true

    // },
    devServer: {
        contentBase: __dirname + "/public/",
        // inline: true,
        // port: 8080
        // hot: true
        // proxy: {
        //     "/": "http://localhost:4000"
        // }
    }
};
