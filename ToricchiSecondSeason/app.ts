import { AppData } from "./AppData";
import { sendMessageToChannel, modifyNewLineStr, memoryMessage } from "./DiscordHelper";
'use strict';

// 設定項目
const token = '<DiscordBOTのトークン>';

// 処理失敗メッセージ
const failedMessage = '処理に失敗しました:';

//ログイン処理
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log('起動します...');
});

// メッセージの受信
client.on('message', message => {
    //Bot自身の発言を無視する
    if (message.author.bot) {
        return;
    }
    // 最後のメッセージを保持、表示
    memoryMessage(message);

    // ここから各種メッセージに対する動作定義
    // 完全一致
    if (message.content === 'ping') {
        //message.reply('何だてめぇ…');  // 直レス
        message.channel.send(`何だテメェ…`);
    }

    if (message.content === 'test') {
        message.channel.send(`テストするぜ`);

        var aaaa = new AppData();
        message.channel.send(`テストメソッドの結果:${aaaa.Method1()}`);

        //let photo = new Task();
        //photo.title = "Me and You";
        //photo.ananan = "ananan";

        //TaskController.add(photo).then(() => {
        //}).catch((err) => {
        //    console.log(`${ failedMessage } ${ err.message }`);
        //});

    }

    if (message.content === '!help') {
        message.channel.send(`テメェには教えてやんねー！`);
        return true;
    }

    // キーワードを含む
    if (message.content.match(/おはよ/)) {
        let reply_text = `おはようございます！\n今日もよろしく！`;
        // リプライで返信する
        console.log(`返信します`);
        message.reply(reply_text)
            .then(message => console.log(`Sent message: ${reply_text}`))
            .catch(console.error);
        return;
    }

    // キーワードで始まる
    if (message.content.match(/^!speak [0-9]* \S*/)) {
        var splitted = message.content.split(" ", 3);
        // 改行変換する
        sendMessageToChannel(client, splitted[1], modifyNewLineStr(splitted[2]));
        return true;
    }


    // メッセージに対する動作定義ここまで

});


client.login(token);



