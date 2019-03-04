import { AppData } from "./AppData";
import { sendMessageToChannel, modifyNewLineStr, memoryMessage, replaceMessage, evalFunction } from "./DiscordHelper";
import Parameter from "./models/Parameter";
import { failedMessage, initialMessage, startupMessage } from "./MessageConstants";
import ParameterController from "./controllers/ParametersController";
import ReplyMessageController from "./controllers/ReplyMessagesController";
'use strict';

// 設定項目
const token = '<DiscordBOTのトークン>';

//ログイン処理
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    // 初期状態チェック
    // と言っても特に何もしていなくて、一旦DBにアクセスすることでテーブル作成しているだけ。
    var w = ParameterController.all().then((parameter) => {
        if (parameter.length == 0) {
            console.log(`${initialMessage}`);
        }
    }).catch((err) => {
        console.log(`${failedMessage} ${err.message}`);
    });

    // 完了メッセージ
    console.log(`${startupMessage}`);
});

// メッセージの受信
client.on('message', async message => {
    //Bot自身の発言を無視する
    if (message.author.bot) {
        return;
    }
    // 最後のメッセージを保持、表示
    memoryMessage(message);

    // メッセージから特定の文字を除外する
    var tempMessage = replaceMessage(message.content);
    if (tempMessage.length > 0) {
        // 条件に合ったメッセージを取得
        var candidateList = await getCandidateList(tempMessage);

        // 候補がある場合
        if (candidateList.length > 0) {
            // TODO:発言者データから現在ポイントを取得
            var point = 5;  // TODO:仮値

            // ポイントの高い物から判定
            var messageData = candidateList[0];
            messageData = candidateList.find(function (value) {
                return !value.requirePointMin || value.requirePointMin <= point;
            });

            // 単純なメッセージ返信
            console.log(`${messageData.requirePointMin}:${point}`);
            message.channel.send(messageData.reply);

            // 関数の動的呼び出し
            var success = true;
            if (messageData.function) {
                success = evalFunction(messageData.function);
            }

            // 全て成功したら発言者に好感度加算
            if (success) {
                if (messageData.friendryPoint) {
                    console.log(`好感度加算する:${messageData.friendryPoint}`);
                }
            } else {
                console.log(`好感度加算しない`);
            }
        }

    } else {
        // 除外した結果何もなくなった
        message.channel.send(`は？`);
    }
});


client.login(token);

/**
 * メッセージ候補を降順で取得する
 * @param messageContent メッセージ本文
 * @returns list メッセージ候補（ポイント降順）
 */
async function getCandidateList(messageContent) {
    var candidateList = [];
    // メッセージ一覧を取得（完了まで待つ）
    await ReplyMessageController.all().then((messageList) => {
        // 条件に合ったメッセージを集める
        messageList.forEach((value) => {
            if (messageContent.match(new RegExp(value.word, 'g'))) {
                candidateList.push(value);
            }
        });

        // 降順に並び変える
        candidateList.sort(function (a, b) {
            if (a == null && b == null) return 0;
            if (a == null) return 1;
            if (b == null) return -1;
            if (a.requirePointMin < b.requirePointMin) return 1;
            if (a.requirePointMin > b.requirePointMin) return -1;
            return 0;
        });
    }).catch((err) => {
    });
    return candidateList;

}

