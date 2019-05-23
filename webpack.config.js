const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function () {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        mode: isProduction ? 'production' : 'development',
        entry: [
            '@babel/polyfill', //includes regenerator runtime (allows use of generators) and core-js
            './client/index.js'
        ],
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'bundle.js'
        },
        optimization: {
            minimize: isProduction,
        },
        devtool: isProduction ? false : 'inline-source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
        plugins: [
            new CopyWebpackPlugin([
                {from: './fav-icon.png'},
                {from: './client/not-logged-in.css'},
            ]),
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: path.resolve(__dirname, 'client'),
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    }
                },
                {
                    test: /\.(css)$/,
                    include: path.resolve(__dirname, 'client'),
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                    ]
                },
            ]
        },
    }
}
