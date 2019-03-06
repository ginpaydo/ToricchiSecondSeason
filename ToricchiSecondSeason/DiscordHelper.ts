import { trimList, failedMessage, makeCharacterMessage, dbErrMessage } from "./MessageConstants";
import ParameterController from "./controllers/ParametersController";
import Parameter from "./models/Parameter";
import Character from "./models/Character";
import CharacterController from "./controllers/CharactersController";

// Discordについての処理関数と、変数

// **** とりっっちに関する関数をここに集めておく**** //

// 最後のメッセージを保持
export var lastMessage;
// とりっっちのパラメータキャッシュ
var parameterCache = null;
// TODO:利用者データのキャッシュ

/**
 * 利用者データを取得する
 * 無ければ作成する
 * @param message メッセージデータ
 * @returns 利用者データ
 */
export async function getCharacter(message): Promise<Character> {
    CharacterController.get(message.author.id).then((character) => {
        return character;
    }).catch((err) => {
        // 無かったので作成
        console.log(makeCharacterMessage);
        var newCharacter = new Character();
        newCharacter.id = message.author.id;
        newCharacter.like = 0;
        newCharacter.name = message.author.username;
        CharacterController.add(newCharacter).then((character) => {
            return character;
        }).catch((err) => {
            console.log(dbErrMessage);
            console.log(err);
            return null;
        });
    });
    return null;
}

/**
 * 利用者データに好感度を加算する
 * @param character 利用者データ
 * @param like ポイント増分
 * @returns 利用者データ
 */
export async function addLike(character, like): Promise<Character> {
    // 最小値は-5
    character.like = Math.max(-5, character.like + like);

    // 更新
    CharacterController.update(character.id, character).then((character) => {
        return character;
    }).catch((err) => {
        console.log(dbErrMessage);
        console.log(err);
        return null;
    });
    return null;
}


/**
 * メッセージを受信したときに呼ぶ
 * 最後のメッセージを覚える
 * @param message 受信メッセージ
 */
export async function memoryMessage(message) {
    // 最後のメッセージを保存
    lastMessage = message;

    // MP回復
    await updateParameterMax("Mp", "MaxMp", 1);
    await updateParameterMax("Unko", "MaxUnko", 1);
    // 戦闘不能ならばHP回復
    var isDead = (await getParameter("IsDead")).intValue();
    if (isDead) {
        var temp = await updateParameterMax("Hp", "MaxHp", 1);
        // 最大値になっていたら復活
        if (temp.intValue() === (await getParameter("MaxHp")).intValue()) {
            await updateParameter("IsDead", -1);
        }
    }
    // 収入加算
    var income = (await getParameter("Income")).intValue();
    await updateParameter("Money", income);

    // ログ表示
    console.log(lastMessage.channel.id + " : " + lastMessage.author.username + " : " + lastMessage.content);
    return true;
}

/**
 * 最大値を考慮して加算する
 * @param name パラメータ名
 * @param maxName 最大値パラメータ名
 * @param addValue 加算値
 * @returns 処理後のパラメータ
 */
export async function updateParameterMax(name, maxName, addValue): Promise<Parameter> {
    var maxHp = (await getParameter(maxName)).intValue();
    return await updateParameter(name, addValue, maxHp);
}
/**
 * パラメータを指定してステータスを取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
export async function getParameter(name): Promise<Parameter> {
    // シングルトンでキャッシュする
    if (!parameterCache) {
        parameterCache = await ParameterController.all().then(() => {
        }).catch((err) => {
            console.log(failedMessage);
            console.log(err);
        });
    }
    // 探す
    return parameterCache.filter(item => item.name === name);
}
/**
 * ステータスを更新する
 * @param name パラメータ名
 * @param addValue 加算値
 * @param max 最大値、なければ判定なし、0の時は判定されない
 * @returns 処理後のパラメータ
 */
export async function updateParameter(name, addValue, max = 0): Promise<Parameter> {
    // 取得する
    var tempParameter = await getParameter(name);
    // 加える
    if (max) {
        tempParameter.value = (Math.min(max, tempParameter.intValue + addValue)).toString();
    } else {
        tempParameter.value = (tempParameter.intValue + addValue).toString();
    }
    // 保存
    return await ParameterController.update(tempParameter.id, tempParameter);
}

// **** Discord処理に関する関数をここに集めておく**** //

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


// **** 動的に呼び出す関数をここに集めておく**** //

/**
 * 引数で示された名前の関数を呼び出す
 * @param functionName 関数名
 * @returns 関数の結果
 */
export function evalFunction(functionName) {
    try {
        return eval(functionName + "()");
    } catch (err) {
        console.log(err);
        return false;
    }
}

function Help() {
}


