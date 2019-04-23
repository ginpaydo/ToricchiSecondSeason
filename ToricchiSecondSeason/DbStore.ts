import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import ReplyMessage from './models/ReplyMessage';
import Parameter from './models/Parameter';
import Facility from './models/Facility';
import Character from './models/Character';
import ReplyMessageController from './controllers/ReplyMessagesController';
import FacilityController from './controllers/FacilitiesController';
import ParameterController from './controllers/ParametersController';
import CharacterController from './controllers/CharactersController';
import { characterTable, parameterTable, facilityTable, replyMessageTable } from './MessageConstants';

// 設定ファイル
var config = require('config');
export default class DbStore {
    private static _conn: Connection;

    // データベースの設定
    public static connectionOptions: ConnectionOptions = {
        // 設定を書くこと
        // 詳しくはここ！
        // https://typeorm.io/
        type: config.database.type,
        database: config.database.database,
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        logging: config.database.logging,
        entities: [
            Character,
            Facility,
            Parameter,
            ReplyMessage
        ],
        // Model変更をデータベースのテーブル定義に反映する
        synchronize: config.database.synchronize
    };

    // 接続（シングルトン）
    public static async createConnection() {
        if (!this._conn) {
            this._conn = await createConnection(this.connectionOptions);
        }
        return this._conn;
    }
}

// とりっっちのデータキャッシュ
export var cache = {};

// 各テーブルをキャッシュする
export async function initialize() {
    await CharacterController.all().then((val) => { cache[characterTable] = val; });
    await ParameterController.all().then((val) => { cache[parameterTable] = val; });
    await FacilityController.all().then((val) => { cache[facilityTable] = val; });
    await ReplyMessageController.all().then((val) => { cache[replyMessageTable] = val; });
    console.log(config.messages.cacheEnd);
}

// 各テーブルをDBに一括保存する（削除はしない）
export async function saveAll() {
    var connection = await DbStore.createConnection();
    
    // 各テーブルの保存
    await connection.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(cache[characterTable]);
        await transactionalEntityManager.save(cache[parameterTable]);
        await transactionalEntityManager.save(cache[facilityTable]);
        await transactionalEntityManager.save(cache[replyMessageTable]);
    });
}