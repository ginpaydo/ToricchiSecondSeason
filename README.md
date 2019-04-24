# ToricchiSecondSeason
DiscordBOT製作第二期、TypeScript製、MariaDBを使用。
![ToricchiSecondSeason](https://user-images.githubusercontent.com/39305262/54169110-c287ea00-44b4-11e9-80db-ceb1c9bde233.png "ToricchiSecondSeason")
## はじめに
Discordのチャットで特定の文字に対して反応し、メッセージを返すだけのBOTです。  
特に役立つ機能はありません。  
殆ど自分の勉強用プロジェクトです。  
作った反省点としては、型は分かる限りは書かないとIDEが活かせないことだと思います。
### 前提条件
javascript(node.js)が動作する環境ならば動作します。  
別途、MariaDBを準備する必要があります。  
Discord用BOTなので、[Discord開発者用ページ](https://discordapp.com/developers/applications/) でトークンを作成しておく必要があります。

### インストール方法
インストールファイルは用意していないので、ローカルにリポジトリをコピーしてビルドする手順が必要。  
app.ts(app.js)をエントリーポイントに起動すれば動作する。  
起動前に、```config/default.yaml```内にDiscord開発者用ページで作成したトークンを設定する。  
また、同ファイルのデータベースの設定部分を環境に合わせて変更する。

#### ■nexeを使う場合
PowreShell等を使って、nexeをグローバルでインストールする。  
```npm i -g nexe@next```  
ビルドして、nexeでパッケージングする。  
app.tsがあるディレクトリまで移動して以下を実行する。  
```nexe app.js```  
※app.tsだとexe起動できない。

この2つを任意のディレクトリに移動する。
* app.exe
* configフォルダ
  
**動作しない場合、node_modulesフォルダが必要かもしれない（未確認）**

#### ■webpackを使う方法（推奨）
webpack.config.jsが同梱されているので、以下のコマンドでwebpackビルドできる。  
```npm run build```
distにjsファイルが出力されるので、これを実行環境にコピー。  
configフォルダもjsと同ディレクトリにコピー。  
  
以下の5つを実行環境でnpmインストールする。  
* discord.js
* mysql
* typeorm
* node-config
* config

### 使用方法
exe実行したらプロンプト画面が出てくるので、そのままにしておく。  
DiscordにBOTを追加する。
（https://discordapp.com/oauth2/authorize?client_id=<Discord開発者用ページで取得したクライアントID>&scope=bot&permissions=0）

## 協働するシステムのリスト
* [Discord](https://discordapp.com/) - Discord
* [discord.js](https://discord.js.org/#/) - Discord BOT用ライブラリ
* MariaDB
* typeorm
* node-config

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
