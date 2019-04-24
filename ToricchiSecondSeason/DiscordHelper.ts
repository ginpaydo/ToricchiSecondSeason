import { trimList } from "./MessageConstants";
import { updateToricchi } from "./ToricchiHelper";

// Discordについての処理関数と、変数
// 最後のメッセージを保持
export var lastMessage;

/**
 * メッセージを受信したときに呼ぶ
 * 最後のメッセージを覚える
 * @param message 受信メッセージ
 */
export async function memoryMessage(message) {
    // 最後のメッセージを保存
    lastMessage = message;

    // とりっっちの状態更新
    await updateToricchi();

    // ログ表示
    console.log(lastMessage.channel.id + " : " + lastMessage.author.username + " : " + lastMessage.content);
    return true;
}

/**
 * 任意のチャンネルに対してメッセージ送信
 * @param client Discordクライアント
 * @param channelId チャンネルID
 * @param messageStr メッセージ文字列
 */
export function sendMessageToChannel(client, channelId, messageStr) {
    var channel = client.channels.get(channelId);
    channel.send(messageStr);
    return true;
}

/**
 * 文字列に"\n"が含まれていたら改行する
 * @param messageStr メッセージ文字列
 */
export function modifyNewLineStr(messageStr) {
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

/**
 * 文字列から特定の文字を除外する
 * @param messageStr メッセージ文字列
 * @returns 除外後の文字列
 */
export function replaceMessage(messageStr) {

    var result = messageStr;
    trimList.forEach((value) => {
        result = result.split(value).join('');
    }); 
    
    return result;
}