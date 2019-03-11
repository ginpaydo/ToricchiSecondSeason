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
require("reflect-metadata");
const DiscordHelper_1 = require("./DiscordHelper");
const MessageConstants_1 = require("./MessageConstants");
const ParametersController_1 = require("./controllers/ParametersController");
const ToricchiHelper_1 = require("./ToricchiHelper");
const DbStore_1 = require("./DbStore");
const Shop_1 = require("./Shop");
const Parameter_1 = require("./models/Parameter");
'use strict';
// 設定項目
//const token = '<DiscordBOTのトークン>';
const token = 'NDE3ODkyMzU0NDgyMjQxNTQ2.D1P4aA.vTlIbi0U9qltG_zzfHoKNi1RCVk';
//ログイン処理
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => __awaiter(this, void 0, void 0, function* () {
    // 初期状態チェック
    yield ParametersController_1.default.all().then((parameter) => {
        if (parameter.length == 0) {
            // 初期化する
            console.log(MessageConstants_1.initialMessage);
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
        }
    }).catch((err) => {
        console.log(`${MessageConstants_1.failedMessage} ${err.message}`);
    });
    // データベースのデータをキャッシュする
    console.log(MessageConstants_1.cacheMessage);
    DbStore_1.initialize();
    // TODO:
    var now = new Date();
    var day = now.getHours();
    console.log(day);
    // 完了メッセージ
    console.log(MessageConstants_1.startupMessage);
}));
/**
 * とりっちの名前変更
 * @param newname
 */
function setBotName(newname) {
    console.log("名前変更：" + newname);
    if (id) {
        client.fetchUser(id).then((value) => {
            value.setUsername(newname);
            var name = ToricchiHelper_1.getParameter("Name");
            name.value = newname;
            value.lastMessage.member.setNickname(newname).catch(() => { console.log("名前変更失敗"); });
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
// とりっちのID
var id = null;
// メッセージの受信
client.on('message', message => {
    //Bot自身の発言を無視する
    if (message.author.bot) {
        if (!id) {
            var paramId = ToricchiHelper_1.getParameter("BotUserId");
            var name = ToricchiHelper_1.getParameter("Name");
            if (paramId) {
                id = paramId.value;
                console.log(name.value + "のIDは" + id);
            }
            else {
                // 初回起動
                if (name.value === message.author.username) {
                    makeParameter("BotUserId", message.author.id, 99, "BOTのID");
                    console.log(name.value + "のIDは" + message.author.id);
                    id = message.author.id;
                    if (name.value === MessageConstants_1.defaultBotName1 + MessageConstants_1.defaultBotName2 + MessageConstants_1.defaultBotName3) {
                        makeParameter("IsToricchi", "1", 99, "とりっちモード");
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
                // 除外した結果何もなくなった
                message.channel.send(`は？`);
            }
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
//# sourceMappingURL=app.js.map