"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _t = require('typeorm');
const _r = require('reflect-metadata');
const DiscordHelper_1 = require("./DiscordHelper");
const MessageConstants_1 = require("./MessageConstants");
const ToricchiHelper_1 = require("./ToricchiHelper");
const DbStore_1 = require("./DbStore");
const Shop_1 = require("./Shop");
const Parameter_1 = require("./models/Parameter");
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
var reconnecting = 0; // 接続中
client.on('error', (error) => __awaiter(this, void 0, void 0, function* () {
    if (reconnecting == 0) {
        reconnecting = 1; // 切断中
        showError(error);
        // 強制切断
        console.log(config.messages.destroy);
        client.destroy().then((value) => __awaiter(this, void 0, void 0, function* () {
            console.log(config.messages.destroyEnd);
            yield reconnect(10);
        }));
    }
}));
/**
 * 繋がるまで再接続を試みます
 * @param seconds 待ち時間（秒）
 */
function reconnect(seconds) {
    return __awaiter(this, void 0, void 0, function* () {
        while (reconnecting == 1) {
            // 数秒待つ
            console.log(seconds + config.messages.reconnectWait);
            yield sleep(seconds * 1000);
            // 再接続
            console.log(config.messages.reconnect);
            yield client.login(token).then(() => {
                // 何故かここに来ない。ライブラリの不具合？
                console.log(config.messages.reconnectEnd);
                reconnecting = 0;
            }).catch((error) => {
                showError(error);
            });
        }
    });
}
// 初期化処理
client.on('ready', () => __awaiter(this, void 0, void 0, function* () {
    // データベースのデータをキャッシュする
    console.log(MessageConstants_1.cacheMessage);
    yield DbStore_1.initialize();
    // 初期状態チェック
    if (DbStore_1.cache["parameter"].length == 0) {
        // 設定ファイルに基づいて初期化する
        console.log(MessageConstants_1.initialMessage);
        config.initialParameter.forEach((value) => {
            makeParameter(value.name, value.value, value.visibleLevel, value.display);
        });
        DbStore_1.saveAll();
    }
    // 完了メッセージ
    console.log(MessageConstants_1.startupMessage);
}));
/**
 * とりっちの名前変更
 * @param newname
 */
function setBotName(newname) {
    console.log(config.messages.changeName + newname);
    if (id) {
        client.fetchUser(id).then((value) => {
            value.setUsername(newname);
            var name = ToricchiHelper_1.getParameter("Name");
            name.value = newname;
            value.lastMessage.member.setNickname(newname).catch((error) => {
                showError(error);
            });
        });
    }
}
exports.setBotName = setBotName;
// パラメータを追加する
function makeParameter(name, value, visibleLevel, display) {
    var parameter = new Parameter_1.default();
    parameter.value = value;
    parameter.name = name;
    parameter.visibleLevel = visibleLevel;
    parameter.display = display;
    DbStore_1.cache["parameter"].push(parameter);
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
                var paramId = ToricchiHelper_1.getParameter("BotUserId");
                var name = ToricchiHelper_1.getParameter("Name");
                if (paramId) {
                    id = paramId.value;
                }
                else {
                    // 初回起動
                    if (name.value === message.author.username) {
                        // BOTのIDを記憶する
                        makeParameter(config.botId.name, message.author.id, config.botId.visibleLevel, config.botId.display);
                        id = message.author.id;
                        // 既定の名前になっている場合、とりっちモードにし、死亡イベントで名前が変更される
                        if (name.value === MessageConstants_1.defaultBotName1 + MessageConstants_1.defaultBotName2 + MessageConstants_1.defaultBotName3) {
                            makeParameter(config.toricchiMode.name, config.toricchiMode.value, config.toricchiMode.visibleLevel, config.toricchiMode.display);
                        }
                    }
                }
            }
            return;
        }
        // 最後のメッセージを保持、表示
        DiscordHelper_1.memoryMessage(message);
        // 死んでたら更新処理のみ
        var isDead = ToricchiHelper_1.getParameterNumber("IsDead");
        if (!isDead) {
            // メッセージから特定の文字を除外する
            var tempMessage = DiscordHelper_1.replaceMessage(message.content);
            if (!Shop_1.shopping()) {
                // 買い物ではない場合
                if (tempMessage.length > 0) {
                    // 条件に合ったメッセージを取得
                    var candidateList = getCandidateList(tempMessage);
                    // 候補がある場合
                    if (candidateList.length > 0) {
                        // 発言者データ取得関数
                        var character = ToricchiHelper_1.getCharacter(message);
                        // ポイントの高い物から使用するメッセージを判定
                        var messageData = candidateList.find(function (value) {
                            return !value.requirePointMin || value.requirePointMin <= character.like;
                        });
                        // 単純なメッセージ返信
                        if (messageData.reply) {
                            var mes = ToricchiHelper_1.correctMessage(messageData.reply);
                            message.channel.send(mes);
                        }
                        // 関数の動的呼び出し
                        var success = true;
                        if (messageData.function) {
                            success = ToricchiHelper_1.evalFunction(messageData.function);
                        }
                        // 全て成功したら発言者に好感度加算
                        if (success) {
                            if (messageData.friendlyPoint) {
                                ToricchiHelper_1.addLike(character, messageData.friendlyPoint);
                            }
                        }
                    }
                }
                else {
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
            DbStore_1.saveAll();
            console.log(config.messages.saveEnd);
        }
    }
    catch (error) {
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
    DbStore_1.cache["replyMessage"].forEach((value) => {
        if (messageContent.match(new RegExp(value.word, 'g'))) {
            candidateList.push(value);
        }
    });
    // 降順に並び変える
    candidateList.sort(function (a, b) {
        if (a.requirePointMin == null && b.requirePointMin == null)
            return 0;
        if (a.requirePointMin == null)
            return 1;
        if (b.requirePointMin == null)
            return -1;
        if (a.requirePointMin < b.requirePointMin)
            return 1;
        if (a.requirePointMin > b.requirePointMin)
            return -1;
        return 0;
    });
    return candidateList;
}
/**
 * 待機する
 * @param milliseconds ミリ秒
 */
function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), milliseconds);
    });
}
/**
 * エラー内容表示
 * @param error
 */
function showError(error) {
    console.log(config.messages.reconnectFailed + error.name);
    console.log(error.message);
    console.log(error.stack);
}
/**
 * ランダムで選択するメッセージ
 * @param values
 */
function randomMessage(values) {
    return values[Math.floor(Math.random() * values.length)];
}
//# sourceMappingURL=app.js.map