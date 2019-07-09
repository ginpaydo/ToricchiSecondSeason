"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = require("./models/Character");
const MessageConstants_1 = require("./MessageConstants");
const DbStore_1 = require("./DbStore");
const DiscordHelper_1 = require("./DiscordHelper");
const Shop_1 = require("./Shop");
const app_1 = require("./app");
// 設定ファイル
var config = require('config');
/**
 * 利用者データを取得する
 * 無ければ作成する
 * @param message メッセージデータ
 * @returns 利用者データ
 */
function getCharacter(message) {
    // 探す
    var result = DbStore_1.cache[MessageConstants_1.characterTable].find(item => item.id === message.author.id);
    if (!result) {
        // 無かったので作成
        console.log(config.messages.makeCharacterMessage + message.author.username);
        result = new Character_1.default();
        result.id = message.author.id;
        result.like = 0;
        result.name = message.author.username;
        DbStore_1.cache[MessageConstants_1.characterTable].push(result);
    }
    return result;
}
exports.getCharacter = getCharacter;
/**
 * 利用者データに好感度を加算する
 * @param character 利用者データ
 * @param like ポイント増分
 */
function addLike(character, like) {
    // 最小値は-5
    character.like = Math.max(-5, character.like + like);
}
exports.addLike = addLike;
/**
 * 好感度を初期値にする
 * @param character 利用者データ
 */
function resetLike(character) {
    character.like = 0;
}
exports.resetLike = resetLike;
/**
 * メッセージ受信ごとにとりっっちの状態を更新する
 */
function updateToricchi() {
    // MP回復
    updateParameterMax("Mp", "MaxMp", 1);
    updateParameterMax("Stress", "MaxStress", 1);
    // 収入加算
    var income = getParameterNumber("Income");
    updateParameter("Money", income);
    // 戦闘不能ならばHP回復
    var isDead = getParameterNumber("IsDead");
    if (isDead == 1) {
        var temp = updateParameterMax("Hp", "MaxHp", 1);
        console.log("現在HP:" + temp.value);
        // 最大値になっていたら復活
        if (Number(temp.value) === getParameterNumber("MaxHp")) {
            console.log("復活します");
            updateParameter("IsDead", -1);
            // 名前変更
            if (getParameter("IsToricchi")) {
                var death = getParameterNumber("Death");
                death = Math.min(50 - config.defaultName.head.length - config.defaultName.foot.length, death);
                var sb = config.defaultName.body;
                for (var i = 0; i < death; i++) {
                    sb = sb + config.defaultName.body;
                }
                app_1.setBotName(config.defaultName.head + sb + config.defaultName.foot);
            }
        }
    }
}
exports.updateToricchi = updateToricchi;
/**
 * 指定文字数まで文字埋めする
 * @param val
 * @param char
 * @param n
 */
function paddingright(val, char, n) {
    for (; val.length < n; val += char)
        ;
    return val;
}
/**
 * メッセージを修正する
 * @param mes 元のメッセージ
 * @returns 修正後のメッセージ
 */
function correctMessage(mes) {
    if (mes) {
        var mes = mes.split("\\n").join('\n'); // \nで改行させる
        mes = mes.split("{name}").join(DiscordHelper_1.lastMessage.author.username); // {name}に名前を代入する
        mes = mes.split("{botname}").join(getParameter("Name").value); // {botname}に名前を代入する
    }
    return mes;
}
exports.correctMessage = correctMessage;
/**
 * 最大値を考慮して加算する
 * @param name パラメータ名
 * @param maxName 最大値パラメータ名
 * @param addValue 加算値
 * @returns 処理後のパラメータ
 */
function updateParameterMax(name, maxName, addValue) {
    var tempmax = getParameter(maxName);
    console.log("zzzz");
    if (tempmax) {
        console.log("aaaa");
        var maxValue = Number(tempmax.value);
        return updateParameter(name, addValue, maxValue);
    }
    console.log("cccc");
    return tempmax;
}
exports.updateParameterMax = updateParameterMax;
/**
 * パラメータを指定してステータスを取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
function getParameter(name) {
    // 探す
    console.log("dddd");
    var result = DbStore_1.cache[MessageConstants_1.parameterTable].find(item => item.name === name);
    console.log("eeee");
    return result;
}
exports.getParameter = getParameter;
/**
 * パラメータを指定してステータスの数値を取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
function getParameterNumber(name) {
    var value = getParameter(name);
    return Number(value.value);
}
exports.getParameterNumber = getParameterNumber;
/**
 * ステータスを更新する（保存はしない）
 * @param name パラメータ名
 * @param addValue 加算値
 * @param max 最大値、なければ判定なし、0の時は判定されない
 * @returns 処理後のパラメータ
 */
function updateParameter(name, addValue, max = 0) {
    // 取得する
    var tempParameter = getParameter(name);
    // 加える
    if (max) {
        tempParameter.value = (Math.min(max, Number(tempParameter.value) + addValue)).toString();
    }
    else {
        tempParameter.value = (Number(tempParameter.value) + addValue).toString();
    }
    return tempParameter;
}
exports.updateParameter = updateParameter;
/**
 * 整数の乱数作成
 * @param min この数以上の整数
 * @param max この数未満の整数
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * 引数で示された名前の関数を呼び出す
 * @param functionName 関数名
 * @returns 関数の結果
 */
function evalFunction(functionName) {
    try {
        return eval(functionName + "()");
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.evalFunction = evalFunction;
// 各テーブルをDBに一括保存する（削除はしない）
function Save() {
    DbStore_1.saveAll();
    return true;
}
// ステータス表示
function Status() {
    var character = getCharacter(DiscordHelper_1.lastMessage);
    var level = 1;
    if (character.like >= 10) {
        level = 2;
    }
    var str = "```";
    DbStore_1.cache[MessageConstants_1.parameterTable].filter(function (value) {
        return (value.visibleLevel <= level);
    }).forEach((value) => {
        str = str + "\n" + paddingright(value.display, " ", 10) + ":" + value.value;
    });
    str = str + "```";
    DiscordHelper_1.lastMessage.channel.send(str);
    return true;
}
// 射撃
function Shoottori() {
    var res = getSpeech("message3");
    var character = getCharacter(DiscordHelper_1.lastMessage);
    var randomInt = getRandomInt(0, 10) % 2;
    if (character.like >= 10) {
        switch (randomInt) {
            case 0:
                res = getSpeech("message6");
                updateParameter("Hp", -10);
                break;
            default:
                res = getSpeech("message7");
                updateParameter("Hp", -20);
                break;
        }
    }
    else {
        switch (randomInt) {
            case 0:
                res = res + getSpeech("message4");
                break;
            default:
                res = res + getSpeech("message5");
                break;
        }
    }
    // 死亡判定
    if (getParameterNumber("Hp") <= 0) {
        res = res + getSpeech("message8");
        updateParameter("IsDead", 1);
        updateParameter("Death", 1);
        resetLike(character);
    }
    res = correctMessage(res);
    DiscordHelper_1.lastMessage.channel.send(res);
    return true;
}
// コマンド説明
function Help() {
    var helpstr = "```";
    DbStore_1.cache[MessageConstants_1.replyMessageTable].filter(function (value) {
        return (value.isVisible);
    }).forEach((value) => {
        var result = value.word;
        MessageConstants_1.helpTrimList.forEach((trimchar) => {
            result = result.split(trimchar).join('');
        });
        helpstr = helpstr + "\n" + paddingright(result, " ", 15) + "\t:" + value.comment;
    });
    helpstr = helpstr + "\n```";
    DiscordHelper_1.lastMessage.channel.send(helpstr);
    return true;
}
// デジタルメガフレア
function DigitalMegaFlare() {
    if (getParameterNumber("Mp") >= 100) {
        var income = getParameterNumber("Income") * (getParameterNumber("Stress") + getParameterNumber("Hp"));
        var sb = getSpeech("message0");
        sb = correctMessage(sb);
        sb = sb.split("{income}").join(income.toString());
        DiscordHelper_1.lastMessage.channel.send(sb);
        updateParameter("Mp", -100);
        updateParameter("Money", income);
        return true;
    }
    else {
        DiscordHelper_1.lastMessage.channel.send(getSpeech("message1"));
        return false;
    }
}
// ストレスメッセージ
function Stress() {
    if (getParameterNumber("Stress") >= 50) {
        DiscordHelper_1.lastMessage.channel.send(getSpeech("message2"));
        updateParameter("Stress", -50);
        return true;
    }
    else {
        return false;
    }
}
// 持ち物表示
function Inventory() {
    return Shop_1.inventoryCall();
}
// アイテム購入
function BuyItem() {
    return Shop_1.buyItemCall();
}
exports.BuyItem = BuyItem;
/**
 * 台詞を取得する
 * @param speechNo 台詞番号
 */
function getSpeech(speechNo) {
    var candidateList = [];
    // 条件に合った台詞を集める
    DbStore_1.cache[MessageConstants_1.speechTable].forEach((value) => {
        if (speechNo === value.no) {
            candidateList.push(value);
        }
    });
    // 昇順に並び変える
    candidateList.sort(function (a, b) {
        if (a.dataOrder == null && b.dataOrder == null)
            return 0;
        if (a.dataOrder == null)
            return 1;
        if (b.dataOrder == null)
            return -1;
        if (a.dataOrder > b.dataOrder)
            return 1;
        if (a.dataOrder < b.dataOrder)
            return -1;
        return 0;
    });
    // 改行で繋げる
    var result = "";
    candidateList.forEach((value) => {
        result = result + "\n" + value.data;
    });
    // 特殊タグを置き換える
    result = correctMessage(result);
    return result;
}
exports.getSpeech = getSpeech;
//# sourceMappingURL=ToricchiHelper.js.map