"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbStore_1 = require("./DbStore");
const DiscordHelper_1 = require("./DiscordHelper");
const ToricchiHelper_1 = require("./ToricchiHelper");
const MessageConstants_1 = require("./MessageConstants");
// お買い物関係
/**
 * 持ち物リスト表示
 * @returns テキスト
 */
function showInventory() {
    var list = DbStore_1.cache[MessageConstants_1.facilityTable].filter(function (value) {
        return (value.level > 0);
    });
    var sb = "";
    sb = sb + "```";
    if (Object.keys(list).length == 0) {
        sb = sb + ToricchiHelper_1.getSpeech("message9");
    }
    else {
        sb = sb + ToricchiHelper_1.getSpeech("message10");
        list.forEach((value) => {
            sb = sb + `\n[${value.id}]${value.name}:レベル${value.level} 総合生産量${value.currentIncome}円\n\t${value.comment}`;
        });
    }
    sb = sb + "```";
    sb = ToricchiHelper_1.correctMessage(sb);
    return sb;
}
exports.showInventory = showInventory;
/**
 * 買い物リスト表示
 * @param budget 予算
 * @returns テキスト
 */
function showBuyList(budget) {
    var list = DbStore_1.cache[MessageConstants_1.facilityTable].filter(function (value) {
        return (value.currentPrice < budget);
    });
    var sb = "```";
    if (Object.keys(list).length == 0) {
        return null;
    }
    else {
        sb = sb + ToricchiHelper_1.getSpeech("message10");
        list.forEach((value) => {
            sb = sb + `\n[${value.id}]${value.name}:レベル${value.level} 購入価格${value.currentPrice}円 生産力${value.baseIncome}円\n\t${value.comment}`;
        });
    }
    sb = sb + "```";
    sb = ToricchiHelper_1.correctMessage(sb);
    return sb;
}
exports.showBuyList = showBuyList;
/**
 * 買い物成功
 */
function toricchiItemSuccess() {
    var res = ToricchiHelper_1.getSpeech("message11");
    var character = ToricchiHelper_1.getCharacter(DiscordHelper_1.lastMessage);
    if (character.like >= 5) {
        if (character.like >= 10) {
            res = ToricchiHelper_1.getSpeech("message12");
        }
        else {
            res = ToricchiHelper_1.getSpeech("message13");
        }
    }
    DiscordHelper_1.lastMessage.channel.send(res);
    character.like++;
    return true;
}
exports.toricchiItemSuccess = toricchiItemSuccess;
/**
 * 買い物失敗
 */
function toricchiItemFailure() {
    var res = ToricchiHelper_1.getSpeech("message14");
    var character = ToricchiHelper_1.getCharacter(DiscordHelper_1.lastMessage);
    if (character.like >= 5) {
        if (character.like >= 10) {
            res = ToricchiHelper_1.getSpeech("message15");
        }
        else {
            res = ToricchiHelper_1.getSpeech("message16");
        }
    }
    DiscordHelper_1.lastMessage.channel.send(res);
    character.like--;
    return false;
}
exports.toricchiItemFailure = toricchiItemFailure;
/**
 * 収入を計算する
 * @returns 収入
 */
function calculateIncome() {
    var sum = 0;
    DbStore_1.cache[MessageConstants_1.facilityTable].forEach((value) => {
        sum += value.currentIncome;
    });
    return sum;
}
/**
 * 買い物中ならば買い物をする
 * @returns 買い物判定をしたならばtrue
 */
function shopping() {
    if (buyWith && buyWith == DiscordHelper_1.lastMessage.author.id) {
        var item = DbStore_1.cache[MessageConstants_1.facilityTable].find((value => DiscordHelper_1.lastMessage.content === String(value.id)));
        if (item) {
            // お買い物
            // お金減少
            ToricchiHelper_1.updateParameter("Money", -item.currentPrice);
            // アイテム状態更新
            item.level++;
            item.currentPrice = Math.floor(item.currentPrice * 1.1);
            item.currentIncome = item.level * item.baseIncome;
            // 収入変更
            var inc = ToricchiHelper_1.getParameter("Income");
            inc.value = String(calculateIncome());
            toricchiItemSuccess();
        }
        else {
            toricchiItemFailure();
        }
        buyWith = null;
        budget = 0;
        return true;
    }
    else {
        return false;
    }
}
exports.shopping = shopping;
// 一緒にお買い物している人情報
var buyWith = null;
var budget = null;
// アイテム購入
function buyItemCall() {
    var res = "";
    var character = ToricchiHelper_1.getCharacter(DiscordHelper_1.lastMessage);
    budget = ToricchiHelper_1.getParameterNumber("Money");
    if (character.like >= 5) {
        if (character.like < 10) {
            budget = budget * 7 / 10;
        }
    }
    else {
        // 所持金の3割
        budget = budget * 3 / 10;
    }
    // 品物リスト表示
    var buyList = showBuyList(budget);
    if (buyList) {
        res = res + buyList;
        res = res + ToricchiHelper_1.getSpeech("message17");
        // 一緒に買い物中
        buyWith = DiscordHelper_1.lastMessage.author.id;
    }
    else {
        res = res + ToricchiHelper_1.getSpeech("message18");
        buyWith = null;
        budget = 0;
    }
    DiscordHelper_1.lastMessage.channel.send(res);
    return false;
}
exports.buyItemCall = buyItemCall;
// 持ち物表示
function inventoryCall() {
    var res = "";
    //var character = getCharacter(lastMessage);
    // 持ち物リスト表示
    res = res + showInventory();
    DiscordHelper_1.lastMessage.channel.send(res);
    return true;
}
exports.inventoryCall = inventoryCall;
//# sourceMappingURL=Shop.js.map