const _t = require('typeorm');
const _r = require('reflect-metadata');
import { memoryMessage, replaceMessage } from "./DiscordHelper";
import { failedMessage, initialMessage, startupMessage, cacheMessage, defaultBotName1, defaultBotName2, defaultBotName3 } from "./MessageConstants";
import { evalFunction, getCharacter, addLike, getParameterNumber, correctMessage, getParameter } from "./ToricchiHelper";
import { initialize, cache, saveAll } from "./DbStore";
import { shopping } from "./Shop";
import Parameter from "./models/Parameter";
'use strict';

// 設定項目
const token = '<DiscordBOTのトークン>';

//ログイン処理
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', async () => {
    // データベースのデータをキャッシュする
    console.log(cacheMessage);
    await initialize();

    // 初期状態チェック
    if (cache["parameter"].length == 0) {
        // 初期化する
        console.log(initialMessage);
        makeParameter("Name", "とりっち", 1, "なまえ");
        makeParameter("MaxHp", "100", 2, "最大HP");
        makeParameter("MaxMp", "100", 2, "最大MP");
        makeParameter("MaxUnko", "100", 99, "最大値");
        makeParameter("Hp", "100", 1, "HP");
        makeParameter("Mp", "50", 1, "MP");
        makeParameter("Unko", "50", 99, "現在の鬱憤");
        makeParameter("Money", "10000", 2, "資金");
        makeParameter("Income", "1", 2, "収入");
        makeParameter("IsDead", "0", 99, "死んでいるか");
        makeParameter("Death", "0", 99, "死亡回数");
        saveAll();
    }

    // 完了メッセージ
    console.log(startupMessage);
});

/**
 * とりっちの名前変更
 * @param newname
 */
export function setBotName(newname) {
    console.log("名前変更：" + newname)
    if (id) {
        client.fetchUser(id).then((value) => {
            value.setUsername(newname);
            var name = getParameter("Name");
            name.value = newname;
            value.lastMessage.member.setNickname(newname).catch(() => { console.log("名前変更失敗") });
        });
    }
}

// パラメータを追加する
function makeParameter(name: string, value: string, visibleLevel: number, display: string) {
    var parameter = new Parameter();
    parameter.value = value;
    parameter.name = name;
    parameter.visibleLevel = visibleLevel;
    parameter.display = display;
    cache["parameter"].push(parameter);
}

// 前回の時刻
var preHour = 0;
// とりっちのID
var id = null;
// メッセージの受信
client.on('message', message => {

    //Bot自身の発言を無視する
    if (message.author.bot) {
        if (!id) {
            var paramId = getParameter("BotUserId");
            var name = getParameter("Name");
            if (paramId) {
                id = paramId.value;
                console.log(name.value + "のIDは" + id);
            } else {
                // 初回起動
                if (name.value === message.author.username) {
                    makeParameter("BotUserId", message.author.id, 99, "BOTのID");
                    console.log(name.value + "のIDは" + message.author.id);
                    id = message.author.id;

                    if (name.value === defaultBotName1 + defaultBotName2 + defaultBotName3) {
                        makeParameter("IsToricchi", "1", 99, "とりっちモード");
                    }
                }
            }
        }
        return;
    }

    // 最後のメッセージを保持、表示
    memoryMessage(message);
    // 死んでたら更新処理のみ
    var isDead = getParameterNumber("IsDead");
    if (!isDead) {
        // メッセージから特定の文字を除外する
        var tempMessage = replaceMessage(message.content);

        if (!shopping()) {
            // 買い物ではない場合
            if (tempMessage.length > 0) {
                // 条件に合ったメッセージを取得
                var candidateList = getCandidateList(tempMessage);

                // 候補がある場合
                if (candidateList.length > 0) {
                    // 発言者データ取得関数
                    var character = getCharacter(message);

                    // ポイントの高い物から使用するメッセージを判定
                    var messageData = candidateList.find(function (value) {
                        return !value.requirePointMin || value.requirePointMin <= character.like;
                    });

                    // 単純なメッセージ返信
                    if (messageData.reply) {
                        var mes = correctMessage(messageData.reply);
                        message.channel.send(mes);
                    }
                    // 関数の動的呼び出し
                    var success = true;
                    if (messageData.function) {
                        success = evalFunction(messageData.function);
                    }
                    // 全て成功したら発言者に好感度加算
                    if (success) {
                        if (messageData.friendlyPoint) {
                            addLike(character, messageData.friendlyPoint);
                        }
                    }
                }
            } else {
                //// 除外した結果何もなくなった
                //message.channel.send(`は？`);
            }
        }
    }

    // 1時間ごとに保存
    var now = new Date();
    var hour = now.getHours();
    if (hour !== preHour) {
        preHour = hour;
        saveAll();
        console.log("保存しました");
    }
});

// ログイン
client.login(token);

/**
 * メッセージ候補を降順で取得する
 * @param messageContent メッセージ本文
 * @returns メッセージ候補リスト（ポイント降順）
 */
function getCandidateList(messageContent) {
    var candidateList = [];
    // メッセージ一覧を取得

    // 条件に合ったメッセージを集める
    cache["replyMessage"].forEach((value) => {
        if (messageContent.match(new RegExp(value.word, 'g'))) {
            candidateList.push(value);
        }
    });

    // 降順に並び変える
    candidateList.sort(function (a, b) {
        if (a.requirePointMin == null && b.requirePointMin == null) return 0;
        if (a.requirePointMin == null) return 1;
        if (b.requirePointMin == null) return -1;
        if (a.requirePointMin < b.requirePointMin) return 1;
        if (a.requirePointMin > b.requirePointMin) return -1;
        return 0;
    });
    return candidateList;

}
