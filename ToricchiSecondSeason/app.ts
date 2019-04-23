﻿const _t = require('typeorm');
const _r = require('reflect-metadata');
import { memoryMessage, replaceMessage } from "./DiscordHelper";
import { parameterTable, replyMessageTable } from "./MessageConstants";
import { evalFunction, getCharacter, addLike, getParameterNumber, correctMessage, getParameter } from "./ToricchiHelper";
import { initialize, cache, saveAll } from "./DbStore";
import { shopping } from "./Shop";
import Parameter from "./models/Parameter";
'use strict';
// 設定ファイル
var config = require('config');
const token = config.token;

const Discord = require('discord.js');
const client = new Discord.Client();

// ログイン
client.login(token).then(() => {
    console.log(config.messages.discordConnect);
});

// discordクライアントにエラーが発生した場合
// 一旦強制的に切断して、再接続を試みます。
var reconnecting = 0;   // 接続中
client.on('error', async (error: Error) => {
    if (reconnecting == 0) {
        reconnecting = 1;   // 切断中
        showError(error);

        // 強制切断
        console.log(config.messages.destroy);
        client.destroy().then(async (value) => {
            console.log(config.messages.destroyEnd);
            await reconnect(10);
        });
    }
});

/**
 * 繋がるまで再接続を試みます
 * @param seconds 待ち時間（秒）
 */
async function reconnect(seconds: number) {
    while (reconnecting == 1) {
        // 数秒待つ
        console.log(seconds + config.messages.reconnectWait);
        await sleep(seconds * 1000);

        // 再接続
        console.log(config.messages.reconnect);
        await client.login(token).then(() => {
            // 何故かここに来ない。ライブラリの不具合？
            console.log(config.messages.reconnectEnd);
            reconnecting = 0;
        }).catch((error: Error) => {
            showError(error);
        });
    }
}

// 初期化処理
client.on('ready', async () => {
    // データベースのデータをキャッシュする
    console.log(config.messages.cacheMessage);
    await initialize();

    // 初期状態チェック
    if (cache[parameterTable].length == 0) {
        // 設定ファイルに基づいて初期化する
        console.log(config.messages.initialMessage);
        config.initialParameter.forEach((value) => {
            makeParameter(value.name, value.value, value.visibleLevel, value.display);
        });
        saveAll();
    }

    // 完了メッセージ
    console.log(config.messages.startupMessage);
});

/**
 * とりっちの名前変更
 * @param newname
 */
export function setBotName(newname) {
    console.log(config.messages.changeName + newname)
    if (id) {
        client.fetchUser(id).then((value) => {
            value.setUsername(newname);
            var name = getParameter("Name");
            name.value = newname;
            value.lastMessage.member.setNickname(newname).catch((error: Error) => {
                showError(error);
            });
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
    cache[parameterTable].push(parameter);
}

// 前回の時刻
var preHour = 0;
// とりっちのID
var id = null;
// メッセージの受信
client.on('message', message => {
    try {
        //Bot自身の発言を無視する
        if (message.author.bot) {
            if (!id) {
                var paramId = getParameter("BotUserId");
                var name = getParameter("Name");
                if (paramId) {
                    id = paramId.value;
                } else {
                    // 初回起動
                    if (name.value === message.author.username) {
                        // BOTのIDを記憶する
                        makeParameter(config.botId.name, message.author.id, config.botId.visibleLevel, config.botId.display);
                        id = message.author.id;
                        // 既定の名前になっている場合、とりっちモードにし、死亡イベントで名前が変更される
                        if (name.value === config.defaultName.head + config.defaultName.body + config.defaultName.foot) {
                            makeParameter(config.toricchiMode.name, config.toricchiMode.value, config.toricchiMode.visibleLevel, config.toricchiMode.display);
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
                    // 不要な文字を除外した結果何もなくなった場合はランダムで返答する
                    // 画像だけの場合もあるので
                    if (!message.attachments.size || message.attachments.size === 0) {
                        message.channel.send(randomMessage(config.nothingMessage));
                    }
                }
            }
        }

        // 1時間ごとに保存
        var now = new Date();
        var hour = now.getHours();
        if (hour !== preHour) {
            preHour = hour;
            saveAll();
            console.log(config.messages.saveEnd);
        }
    } catch (error) {
        showError(error);
    }
});

/**
 * メッセージ候補を降順で取得する
 * @param messageContent メッセージ本文
 * @returns メッセージ候補リスト（ポイント降順）
 */
function getCandidateList(messageContent) {
    var candidateList = [];
    // メッセージ一覧を取得

    // 条件に合ったメッセージを集める
    cache[replyMessageTable].forEach((value) => {
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

/**
 * 待機する
 * @param milliseconds ミリ秒
 */
function sleep(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), milliseconds);
    });
}

/**
 * エラー内容表示
 * @param error
 */
function showError(error: Error) {
    console.log(config.messages.reconnectFailed + error.name);
    console.log(error.message);
    console.log(error.stack);
}

/**
 * ランダムで選択するメッセージ
 * @param values
 */
function randomMessage(values: Array<string>) {
    return values[Math.floor(Math.random() * values.length)];
}
