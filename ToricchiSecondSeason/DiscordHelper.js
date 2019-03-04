"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageConstants_1 = require("./MessageConstants");
/**
 * メッセージを受信したときに呼ぶ
 * 最後のメッセージを覚える
 * @param message 受信メッセージ
 */
function memoryMessage(message) {
    // 最後のメッセージを保存
    exports.lastMessage = message;
    // ログ表示
    console.log(exports.lastMessage.channel.id + " : " + exports.lastMessage.author.username + " : " + exports.lastMessage.content);
    return true;
}
exports.memoryMessage = memoryMessage;
/**
 * 任意のチャンネルに対してメッセージ送信
 * @param client Discordクライアント
 * @param channelId チャンネルID
 * @param messageStr メッセージ文字列
 */
function sendMessageToChannel(client, channelId, messageStr) {
    var channel = client.channels.get(channelId);
    channel.send(messageStr);
    return true;
}
exports.sendMessageToChannel = sendMessageToChannel;
/**
 * 文字列に"\n"が含まれていたら改行する
 * @param messageStr メッセージ文字列
 */
function modifyNewLineStr(messageStr) {
    var splitted = messageStr.split("\\n");
    var result = "";
    splitted.forEach(function (currentValue, index, array) {
        if (result) {
            result = result + "\n";
        }
        // currentValue または array[index] について何かする
        result = result + currentValue;
    });
    return result;
}
exports.modifyNewLineStr = modifyNewLineStr;
/**
 * 文字列から特定の文字を除外する
 * @param messageStr メッセージ文字列
 * @returns 除外後の文字列
 */
function replaceMessage(messageStr) {
    var result = messageStr;
    MessageConstants_1.trimList.forEach((value) => {
        result = result.split(value).join('');
    });
    return result;
}
exports.replaceMessage = replaceMessage;
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
//# sourceMappingURL=DiscordHelper.js.map