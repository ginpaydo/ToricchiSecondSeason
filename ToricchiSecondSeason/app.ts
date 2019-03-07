import { memoryMessage, replaceMessage } from "./DiscordHelper";
import { failedMessage, initialMessage, startupMessage, dbErrMessage, cacheMessage } from "./MessageConstants";
import ParameterController from "./controllers/ParametersController";
import ReplyMessageController from "./controllers/ReplyMessagesController";
import { evalFunction, getCharacter, addLike, getParameterNumber } from "./ToricchiHelper";
import { initialize } from "./DbStore";
'use strict';

// 設定項目
const token = '<DiscordBOTのトークン>';

//ログイン処理
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', async () => {
    // 初期状態チェック
    // と言っても特に何もしていなくて、一旦DBにアクセスすることでテーブル作成しているだけ。
    await ParameterController.all().then((parameter) => {
        if (parameter.length == 0) {
            console.log(initialMessage);
        }
    }).catch((err) => {
        console.log(`${failedMessage} ${err.message}`);
        });

    // データベースのデータをキャッシュする
    console.log(cacheMessage);
    initialize();

    // 完了メッセージ
    console.log(startupMessage);
});

// メッセージの受信
client.on('message', async message => {
    //Bot自身の発言を無視する
    if (message.author.bot) {
        return;
    }
    // 最後のメッセージを保持、表示
    await memoryMessage(message);
    // 死んでたら更新処理のみ
    var isDead = await getParameterNumber("IsDead");
    if (!isDead) {
        // メッセージから特定の文字を除外する
        var tempMessage = replaceMessage(message.content);
        if (tempMessage.length > 0) {
            // 条件に合ったメッセージを取得
            var candidateList = await getCandidateList(tempMessage);

            // 候補がある場合
            if (candidateList.length > 0) {
                // 発言者データ取得関数
                var character = await getCharacter(message);

                // ポイントの高い物から使用するメッセージを判定
                var messageData = candidateList[0];
                messageData = candidateList.find(function (value) {
                    return !value.requirePointMin || value.requirePointMin <= character.like;
                });

                // 単純なメッセージ返信
                if (messageData.reply) {
                    message.channel.send(messageData.reply);
                }
                // 関数の動的呼び出し
                var success = true;
                if (messageData.function) {
                    success = evalFunction(messageData.function);
                }

                // 全て成功したら発言者に好感度加算
                if (success) {
                    if (messageData.friendryPoint) {
                        await addLike(character, messageData.friendryPoint);
                    }
                }
            }
        } else {
            // 除外した結果何もなくなった
            message.channel.send(`は？`);
        }
    }
});

// ログイン
client.login(token);

/**
 * メッセージ候補を降順で取得する
 * @param messageContent メッセージ本文
 * @returns メッセージ候補リスト（ポイント降順）
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
        console.log(dbErrMessage);
        console.log(err);
    });
    return candidateList;

}
