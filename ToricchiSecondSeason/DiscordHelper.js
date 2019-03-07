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
const MessageConstants_1 = require("./MessageConstants");
const ToricchiHelper_1 = require("./ToricchiHelper");
/**
 * メッセージを受信したときに呼ぶ
 * 最後のメッセージを覚える
 * @param message 受信メッセージ
 */
function memoryMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        // 最後のメッセージを保存
        exports.lastMessage = message;
        // とりっっちの状態更新
        yield ToricchiHelper_1.updateToricchi();
        // ログ表示
        console.log(exports.lastMessage.channel.id + " : " + exports.lastMessage.author.username + " : " + exports.lastMessage.content);
        return true;
    });
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
//# sourceMappingURL=DiscordHelper.js.map