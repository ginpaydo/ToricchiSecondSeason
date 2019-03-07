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
const Character_1 = require("./models/Character");
const MessageConstants_1 = require("./MessageConstants");
const DbStore_1 = require("./DbStore");
const DiscordHelper_1 = require("./DiscordHelper");
// **** とりっっちに関する関数をここに集めておく**** //
/**
 * 利用者データを取得する
 * 無ければ作成する
 * @param message メッセージデータ
 * @returns 利用者データ
 */
function getCharacter(message) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.getCharacter = getCharacter;
/**
 * 利用者データに好感度を加算する
 * @param character 利用者データ
 * @param like ポイント増分
 * @returns 利用者データ
 */
function addLike(character, like) {
    return __awaiter(this, void 0, void 0, function* () {
        // 最小値は-5
        character.like = Math.max(-5, character.like + like);
    });
}
exports.addLike = addLike;
/**
 * メッセージ受信ごとにとりっっちの状態を更新する
 */
function updateToricchi() {
    return __awaiter(this, void 0, void 0, function* () {
        // MP回復
        yield updateParameterMax("Mp", "MaxMp", 1);
        yield updateParameterMax("Unko", "MaxUnko", 1);
        // 収入加算
        var income = yield getParameterNumber("Income");
        yield updateParameter("Money", income);
        // 戦闘不能ならばHP回復
        var isDead = yield getParameterNumber("IsDead");
        if (isDead) {
            var temp = yield updateParameterMax("Hp", "MaxHp", 1);
            // 最大値になっていたら復活
            if (Number(temp.value) === (yield getParameterNumber("MaxHp"))) {
                yield updateParameter("IsDead", -1);
            }
        }
    });
}
exports.updateToricchi = updateToricchi;
/**
 * 最大値を考慮して加算する
 * @param name パラメータ名
 * @param maxName 最大値パラメータ名
 * @param addValue 加算値
 * @returns 処理後のパラメータ
 */
function updateParameterMax(name, maxName, addValue) {
    return __awaiter(this, void 0, void 0, function* () {
        var tempmax = null;
        yield getParameter(maxName).then((a) => { tempmax = a; });
        var maxHp = Number(tempmax.value);
        return yield updateParameter(name, addValue, maxHp);
    });
}
exports.updateParameterMax = updateParameterMax;
/**
 * パラメータを指定してステータスを取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
function getParameter(name) {
    return __awaiter(this, void 0, void 0, function* () {
        // 探す
        var result = DbStore_1.cache["parameter"].find(item => item.name === name);
        return result;
    });
}
exports.getParameter = getParameter;
/**
 * パラメータを指定してステータスの数値を取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
function getParameterNumber(name) {
    return __awaiter(this, void 0, void 0, function* () {
        var value = yield getParameter(name);
        return Number(value.value);
    });
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
    return __awaiter(this, void 0, void 0, function* () {
        // 取得する
        var tempParameter = yield getParameter(name);
        // 加える
        if (max) {
            tempParameter.value = (Math.min(max, Number(tempParameter.value) + addValue)).toString();
        }
        else {
            tempParameter.value = (Number(tempParameter.value) + addValue).toString();
        }
        // 保存
        return tempParameter;
    });
}
exports.updateParameter = updateParameter;
// **** 動的に呼び出す関数をここに集めておく**** //
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
// コマンド説明
function Help() {
}
// 各テーブルをDBに一括保存する（削除はしない）
function Save() {
    DbStore_1.saveAll();
}
// 
function Inventory() {
}
// 
function BuyItem() {
}
// 
function Status() {
}
// 
function Shoottori() {
}
// 
function DigitalMegaFlare() {
}
// 
function Unko() {
    DiscordHelper_1.lastMessage.channel.send("うんこ食ってるときにカレーの話をしてんじゃねぇ！:rage:");
    // Unkoを50引く
    return true;
}
//# sourceMappingURL=ToricchiHelper.js.map