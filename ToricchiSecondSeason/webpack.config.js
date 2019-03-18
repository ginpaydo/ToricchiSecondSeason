// node_moduleは無視する
var nodeExternals = require('webpack-node-externals');

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development',
    // メインとなるTypeScriptファイル（エントリーポイント）
    entry: './app.ts',
    // node_moduleは無視する
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                // 拡張子 .ts の場合
                test: /\.ts$/,
                // TypeScript をコンパイルする
                use: 'ts-loader'
            }
        ]
    },
    // import 文で .ts ファイルを解決するため
    resolve: {
        extensions: [
            '.ts', '.js'
        ]
    }
};
