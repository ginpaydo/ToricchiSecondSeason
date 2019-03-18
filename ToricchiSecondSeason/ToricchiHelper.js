"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = require("./models/Character");
const MessageConstants_1 = require("./MessageConstants");
const DbStore_1 = require("./DbStore");
const DiscordHelper_1 = require("./DiscordHelper");
const Shop_1 = require("./Shop");
const app_1 = require("./app");
/**
 * 利用者データを取得する
 * 無ければ作成する
 * @param message メッセージデータ
 * @returns 利用者データ
 */
function getCharacter(message) {
    // 探す
    var result = DbStore_1.cache["character"].find(item => item.id === message.author.id);
    if (!result) {
        // 無かったので作成
        console.log(MessageConstants_1.makeCharacterMessage + message.author.username);
        result = new Character_1.default();
        result.id = message.author.id;
        result.like = 0;
        result.name = message.author.username;
        DbStore_1.cache["character"].push(result);
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
    updateParameterMax("Unko", "MaxUnko", 1);
    // 収入加算
    var income = getParameterNumber("Income");
    updateParameter("Money", income);
    // 戦闘不能ならばHP回復
    var isDead = getParameterNumber("IsDead");
    if (isDead) {
        var temp = updateParameterMax("Hp", "MaxHp", 1);
        console.log("現在HP:" + temp.value);
        // 最大値になっていたら復活
        if (Number(temp.value) === getParameterNumber("MaxHp")) {
            console.log("復活します");
            updateParameter("IsDead", -1);
            // 名前変更
            if (getParameter("IsToricchi")) {
                var death = getParameterNumber("Death");
                death = Math.min(50 - MessageConstants_1.defaultBotName1.length - MessageConstants_1.defaultBotName3.length, death);
                var sb = MessageConstants_1.defaultBotName2;
                for (var i = 0; i < death; i++) {
                    sb = sb + MessageConstants_1.defaultBotName2;
                }
                app_1.setBotName(MessageConstants_1.defaultBotName1 + sb + MessageConstants_1.defaultBotName3);
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
    var mes = mes.split("\\n").join('\n'); // \nで改行させる
    mes = mes.split("{name}").join(DiscordHelper_1.lastMessage.author.username); // {name}に名前を代入する
    mes = mes.split("{botname}").join(getParameter("Name").value); // {botname}に名前を代入する
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
    var maxHp = Number(tempmax.value);
    return updateParameter(name, addValue, maxHp);
}
exports.updateParameterMax = updateParameterMax;
/**
 * パラメータを指定してステータスを取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
function getParameter(name) {
    // 探す
    var result = DbStore_1.cache["parameter"].find(item => item.name === name);
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
// TODO:1時間に1度セーブする
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
    DbStore_1.cache["parameter"].filter(function (value) {
        return (value.visibleLevel <= level);
    }).forEach((value) => {
        str = str + "\n" + paddingright(value.display, " ", 10) + ":" + value.value;
    });
    str = str + "```";
    DiscordHelper_1.lastMessage.channel.send(str);
    return true;
}
// 
function Shoottori() {
    var res = "(´・ω);y==ｰｰｰｰｰ  ・ ・ ・  :penguin:   ・∵. ﾀｰﾝ <:sushi:418038060110970880> ＜ｷﾞﾝｷﾞﾝｶﾞｰﾄﾞ\n```ぎんぺーに 5 ダメージを与えた！\nぎんぺーはGOXしました。```\n";
    var character = getCharacter(DiscordHelper_1.lastMessage);
    var randomInt = getRandomInt(0, 10) % 2;
    if (character.like >= 10) {
        switch (randomInt) {
            case 0:
                res = "(´・ω);y==ｰｰｰｰｰ  ・ ・   <:sushi:418038060110970880>    ・∵. ﾀｰﾝ\n```{botname}に 10 ダメージを与えた！```\n";
                res = res + "ぐっ…油断したぜ。\nお前のことを信じてしまったばかりに……。:confounded:";
                updateParameter("Hp", -10);
                break;
            default:
                res = "…ん？どうした{name}？";
                res = res + "```{name}は、{botname}の背後から優しく抱きしめて引き金を引いた。```\n";
                res = res + "(´・ω);y==<:sushi:418038060110970880>    ・∵. ﾀｰﾝ\n```{botname}に 20 ダメージを与えた！```\n";
                res = res + "ぐあああああああっ！！！！:tired_face:";
                res = res + "```{name}は、{botname}の血を腹に塗りながら笑った。```\n";
                updateParameter("Hp", -20);
                break;
        }
    }
    else {
        switch (randomInt) {
            case 0:
                res = res + "ふん、のろまなお前に俺が撃てるわけねぇだろ:smirk:";
                break;
            default:
                res = res + "…おいお前何てことしやがるんだ！\n見損なったぞ！:rage:";
                break;
        }
    }
    // 死亡判定
    if (getParameterNumber("Hp") <= 0) {
        res = res + "\n```{name}は{botname}を倒した！```\n";
        res = res + "………ッ！\nゴホッ……かはっ……！\n強くなったな{name}…。だが、覚えているがいい。\nお前の心に欲望がある限り、俺は何度でも蘇るだろう。\nその時までせいぜいつかの間の平和を楽しむがいい……。";
        res = res + "\n```こうして、このチャンネルに再び平和が訪れました。\nめでたしめでたし```";
        res = res + "\n```{botname}　制作スタッフ\n\n企画　ぎんぺー\n原案　ぎんぺー\n設計　ぎんぺー\nメインプログラム　ぎんぺー\nシナリオ　ぎんぺー\n疲労　ぎんぺー\n\nAND YOU\n\n\n　　　　　　　　　　　終\n　　　　　　　　　制作・著作\n　　　　　　　　　　━━━━━\n　　　　　　　　　　銀兵堂```";
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
    DbStore_1.cache["replyMessage"].filter(function (value) {
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
        var name = getParameter("Name");
        var income = getParameterNumber("Income") * (getParameterNumber("Unko") + getParameterNumber("Hp"));
        var sb = `「天よ地よ大いなる神よ\n　生きとし生けるもの皆終焉の雄叫びを上げ\n　舞い狂う死神達の宴を始めよ\n　冥界より召喚されし暗黒の扉今開かれん\n　*デジタルメガフレアーーーーーッ！！*」\n\n{botname}の指先から熱線が放たれ、Zaifに深刻なダメージを与えた！！\nZaifはGOXしました。\n{botname}は${income}円獲得しました。`;
        sb = correctMessage(sb);
        DiscordHelper_1.lastMessage.channel.send(sb);
        updateParameter("Mp", -100);
        updateParameter("Money", income);
        return true;
    }
    else {
        DiscordHelper_1.lastMessage.channel.send("す、すまん。MPが足りないようだ……。");
        return false;
    }
}
function Unko() {
    if (getParameterNumber("Unko") >= 50) {
        DiscordHelper_1.lastMessage.channel.send("うんこ食ってるときにカレーの話をしてんじゃねぇ！:rage:");
        updateParameter("Unko", -50);
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
//# sourceMappingURL=ToricchiHelper.js.map