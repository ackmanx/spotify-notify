const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function () {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        mode: isProduction ? 'production' : 'development',
        entry: [
            '@babel/polyfill', //includes regenerator runtime (allows use of generators) and core-js
            './client/index.js',
        ],
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'bundle.js',
        },
        optimization: {
            minimize: isProduction,
        },
        devtool: isProduction ? false : 'inline-source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: './icon.png' },
                { from: './client/styles/not-logged-in.css' },
                { from: './client/images' },
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
                            cacheDirectory: true,
                        },
                    },
                },
                {
                    test: /\.(less|css)$/,
                    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'less-loader' }],
                },
            ],
        },
    }
}
