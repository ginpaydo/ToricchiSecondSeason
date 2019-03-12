# ToricchiSecondSeason
DiscordBOT製作第二期、TypeScript製  
![ToricchiSecondSeason](https://user-images.githubusercontent.com/39305262/54169110-c287ea00-44b4-11e9-80db-ceb1c9bde233.png "ToricchiSecondSeason")
## はじめに
殆ど自分の勉強用プロジェクトなので、一般利用者が動作させるには色々と不十分です。
### 前提条件
javascript(node.js)が動作する環境ならば動かせるはず。
Discord用BOTなので、[Discord開発者用ページ](https://discordapp.com/developers/applications/) でトークンを作成しておく必要あり。

### インストール方法
インストールファイルは用意していないので、ローカルにリポジトリをコピーしてビルドする手順が必要。
app.ts(app.js)をエントリーポイントに起動すれば動作する。
ビルドする前に、app.ts内の以下の部分にDiscord開発者用ページで作成したトークンを書く。
```
// 設定項目
//const token = '<DiscordBOTのトークン>';
```

■nexeを使う場合
PowreShell等を使って、nexeをグローバルでインストールする。
```
npm i -g nexe@next
```
ビルドして、nexeでパッケージングする。  
app.tsがあるディレクトリまで移動して、
```
nexe app.js
```
※app.tsだとexe起動できない。

この3つを任意のディレクトリに移動する。
* app.exe
* dataフォルダ
* node_modulesフォルダ

### 使用方法
exe実行したらプロンプト画面が出てくるので、そのままにしておく。
DiscordにBOTを追加する。
（https://discordapp.com/oauth2/authorize?client_id=<Discord開発者用ページで取得したクライアントID>&scope=bot&permissions=0）

## デプロイ
## 協働するシステムのリスト
* [Discord](https://discordapp.com/) - Discord
* [discord.js](https://discord.js.org/#/) - Discord BOT用ライブラリ
* SQLite3

## コントリビューション
私たちのコーディング規範とプルリクエストの手順についての詳細は[CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) を参照してください。
## バージョン管理
特に使用している仕組みはありません。
## 著者
* **Ginpaydo** - *原著者* - [Ginpaydo](https://github.com/ginpaydo)  

このプロジェクトへの[貢献者](https://github.com/ginpaydo/ToricchiSecondSeason/contributors)のリストもご覧ください。
## ライセンス
このプロジェクトは MIT ライセンスの元にライセンスされています。 詳細は[LICENSE.md](LICENSE.md)をご覧ください。

## 課題
* [致命的な課題はこちら](https://github.com/ginpaydo/ToricchiSecondSeason/issues)
* 各種ハードコードの外部データ化（文字列、好感度による条件分岐）
* グローバル領域に散らかっている関数のクラス化
