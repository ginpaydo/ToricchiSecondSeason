// とりっっちに関する処理
import ParameterController from "./controllers/ParametersController";
import Parameter from "./models/Parameter";
import Character from "./models/Character";
import CharacterController from "./controllers/CharactersController";
import { makeCharacterMessage, dbErrMessage, failedMessage } from "./MessageConstants";
import DbStore from "./DbStore";


// **** とりっっちに関する関数をここに集めておく**** //

// 多分、awaitしてもスレッドが分かれてて競合するので、初期化処理でしゅとくしておくべき
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
    // 利用者データを探す
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
 * メッセージ受信ごとにとりっっちの状態を更新する
 */
export async function updateToricchi() {
    // MP回復
    await updateParameterMax("Mp", "MaxMp", 1);
    await updateParameterMax("Unko", "MaxUnko", 1);
    // 収入加算
    var income = await getParameterNumber("Income");
    await updateParameter("Money", income);
    // 戦闘不能ならばHP回復
    console.log("HPを更新します");
    var isDead = await getParameterNumber("IsDead");
    if (isDead) {
        var temp = await updateParameterMax("Hp", "MaxHp", 1);
        // 最大値になっていたら復活
        if (Number(temp.value) === await getParameterNumber("MaxHp")) {
            await updateParameter("IsDead", -1);
        }
    }
}

/**
 * 最大値を考慮して加算する
 * @param name パラメータ名
 * @param maxName 最大値パラメータ名
 * @param addValue 加算値
 * @returns 処理後のパラメータ
 */
export async function updateParameterMax(name, maxName, addValue): Promise<Parameter> {
    var tempmax = null;
    await getParameter(maxName).then((a) => { tempmax = a; });
    var maxHp = Number(tempmax.value);
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
        await ParameterController.all().then((val) => {
            console.log("パラメータをキャッシュします" + name);
            parameterCache = val;
        }).catch((err) => {
            console.log(failedMessage);
            console.log(err);
        });
    }
    console.log(parameterCache);
    // 探す
    var result: Parameter = parameterCache.find(item => item.name === name);
    return result;
}
/**
 * パラメータを指定してステータスの数値を取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
export async function getParameterNumber(name): Promise<number> {
    var value = await getParameter(name);
    return Number(value.value);
}
/**
 * ステータスを更新する（保存はしない）
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
        tempParameter.value = (Math.min(max, Number(tempParameter.value) + addValue)).toString();
    } else {
        tempParameter.value = (Number(tempParameter.value) + addValue).toString();
    }
    // 保存
    return tempParameter;
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

// 各テーブルをDBに一括保存する
async function Save() {
    var connection = await DbStore.createConnection();

    await connection.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(parameterCache);
        //await transactionalEntityManager.save(photos);

    });

}
