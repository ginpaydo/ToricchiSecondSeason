import { cache } from "./DbStore";
import { lastMessage } from "./DiscordHelper";
import { getCharacter, getParameterNumber, updateParameter, getParameter, correctMessage, getSpeech } from "./ToricchiHelper";
import Facility from "./models/Facility";
import { facilityTable } from "./MessageConstants";

// お買い物関係

/**
 * 持ち物リスト表示
 * @returns テキスト
 */
export function showInventory() {
    var list = cache[facilityTable].filter(function (value) {
        return (value.level > 0);
    });

    var sb = "";
    sb = sb + "```";
    
    if (Object.keys(list).length == 0) {
        sb = sb + getSpeech("message9");
    } else {
        sb = sb + getSpeech("message10");
        list.forEach((value) => {
            sb = sb + `\n[${value.id}]${value.name}:レベル${value.level} 総合生産量${value.currentIncome}円\n\t${value.comment}`;
        });
    }
    sb = sb + "```";
    sb = correctMessage(sb);
    return sb;
}

/**
 * 買い物リスト表示
 * @param budget 予算
 * @returns テキスト
 */
export function showBuyList(budget: number) {
    var list = cache[facilityTable].filter(function (value) {
        return (value.currentPrice < budget);
    });

    var sb = "```";

    if (Object.keys(list).length == 0) {
        return null;
    } else {
        sb = sb + getSpeech("message10");
        list.forEach((value) => {
            sb = sb + `\n[${value.id}]${value.name}:レベル${value.level} 購入価格${value.currentPrice}円 生産力${value.baseIncome}円\n\t${value.comment}`;
        });
    }
    sb = sb + "```";
    sb = correctMessage(sb);
    return sb;
}


/**
 * 買い物成功
 */
export function toricchiItemSuccess() {
    var res = getSpeech("message11");
    var character = getCharacter(lastMessage);

    if (character.like >= 5) {
        if (character.like >= 10) {
            res = getSpeech("message12");
        } else {
            res = getSpeech("message13");
        }
    }
    lastMessage.channel.send(res);
    character.like++;
    return true;
}

/**
 * 買い物失敗
 */
export function toricchiItemFailure() {
    var res = getSpeech("message14");
    var character = getCharacter(lastMessage);

    if (character.like >= 5) {
        if (character.like >= 10) {
            res = getSpeech("message15");
        } else {
            res = getSpeech("message16");
        }
    }
    lastMessage.channel.send(res);
    character.like--;
    return false;
}

/**
 * 収入を計算する
 * @returns 収入
 */
function calculateIncome() {
    var sum = 0;
    cache[facilityTable].forEach((value: Facility) => {
        sum += value.currentIncome;
    });

    return sum;
}

/**
 * 買い物中ならば買い物をする
 * @returns 買い物判定をしたならばtrue
 */
export function shopping() {
    if (buyWith && buyWith == lastMessage.author.id) {

        var item = cache[facilityTable].find((value => lastMessage.content === String(value.id)));

        if (item) {
            // お買い物
            // お金減少
            updateParameter("Money", -item.currentPrice);
            
            // アイテム状態更新
            item.level++;
            item.currentPrice = Math.floor(item.currentPrice * 1.1);
            item.currentIncome = item.level * item.baseIncome;
            // 収入変更
            var inc = getParameter("Income");
            inc.value = String(calculateIncome());

            toricchiItemSuccess();
        } else {
            toricchiItemFailure();
        }

        buyWith = null;
        budget = 0;
        return true;
    } else {
        return false;
    }
}

// 一緒にお買い物している人情報
var buyWith = null;
var budget = null;
// アイテム購入
export function buyItemCall() {
    var res = "";
    var character = getCharacter(lastMessage);
    budget = getParameterNumber("Money");

    if (character.like >= 5) {
        if (character.like < 10) {
            budget = budget * 7 / 10;
        }
    } else {
        // 所持金の3割
        budget = budget * 3 / 10;
    }

    // 品物リスト表示
    var buyList = showBuyList(budget);
    if (buyList) {
        res = res + buyList;
        res = res + getSpeech("message17");
        // 一緒に買い物中
        buyWith = lastMessage.author.id;
    } else {
        res = res + getSpeech("message18");
        buyWith = null;
        budget = 0;
    }
    
    lastMessage.channel.send(res);

    return false;
}

// 持ち物表示
export function inventoryCall() {
    var res = "";
    //var character = getCharacter(lastMessage);
    // 持ち物リスト表示
    res = res + showInventory();

    lastMessage.channel.send(res);
    return true;
}

