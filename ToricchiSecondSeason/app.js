"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppData_1 = require("./AppData");
const TaskController_1 = require("./models/TaskController");
const Task_1 = require("./models/Task");
'use strict';
// 設定項目
//const token = '<DiscordBOTのトークン>';
const token = 'NDE3ODkyMzU0NDgyMjQxNTQ2.D1P4aA.vTlIbi0U9qltG_zzfHoKNi1RCVk';
// 処理失敗メッセージ
const failedMessage = '処理に失敗しました:';
//ログイン処理
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log('起動します...');
    //message.channel.send(`地獄から俺は蘇った…！`);
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
        var aaaa = new AppData_1.AppData();
        message.channel.send(`テストメソッドの結果:${aaaa.Method1()}`);
        let photo = new Task_1.default();
        photo.title = "Me and You";
        photo.ananan = "ananan";
        TaskController_1.default.add(photo).then(() => {
        }).catch((err) => {
            console.log(`${failedMessage} ${err.message}`);
        });
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
// 関数 //
// 最後のメッセージを保持
var lastMessage;
/**
 * メッセージを受信したときに呼ぶ
 * 最後のメッセージを覚える
 * @param message 受信メッセージ
 */
function memoryMessage(message) {
    // 最後のメッセージを保存
    lastMessage = message;
    // ログ表示
    console.log(lastMessage.channel.id + " : " + lastMessage.author.username + " : " + lastMessage.content);
    return true;
}
/**
 * 任意のチャンネルに対してメッセージ送信
 * @param client Discordクライアント
 * @param channelId チャンネルID
 * @param messageStr メッセージ文字列
 */
function sendMessageToChannel(client, channelId, messageStr) {
    var channel = client.channels.get(channelId);
    channel.send(messageStr);
    return true;
}
/**
 * 文字列に"\n"が含まれていたら改行する
 * @param messageStr メッセージ文字列
 */
function modifyNewLineStr(messageStr) {
    var splitted = messageStr.split("\\n");
    var result = "";
    splitted.forEach(function (currentValue, index, array) {
        if (result) {
            result = result + "\n";
        }
        // currentValue または array[index] について何かする
        result = result + currentValue;
    });
    return result;
}
//# sourceMappingURL=app.js.map