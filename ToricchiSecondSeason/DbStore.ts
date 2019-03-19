import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import ReplyMessage from './models/ReplyMessage';
import Parameter from './models/Parameter';
import Facility from './models/Facility';
import Character from './models/Character';
import ReplyMessageController from './controllers/ReplyMessagesController';
import FacilityController from './controllers/FacilitiesController';
import ParameterController from './controllers/ParametersController';
import CharacterController from './controllers/CharactersController';

export default class DbStore {
    private static _conn: Connection;

    // データベースの設定
    public static connectionOptions: ConnectionOptions = {
        // 設定を書くこと
        // 詳しくはここ！
        // https://typeorm.io/
        type: "mysql",
        database: "toricchi",
        host: "bostnex",    // DBと同じサーバにリリースする時は、localhostにする
        port: 3306,
        username: "onak",
        password: "ぱすわーど",
        logging: false,
        entities: [
            Character,
            Facility,
            Parameter,
            ReplyMessage
        ],
        // Model変更をデータベースのテーブル定義に反映する
        synchronize: true
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
    await CharacterController.all().then((val) => { cache["character"] = val; });
    await ParameterController.all().then((val) => { cache["parameter"] = val; });
    await FacilityController.all().then((val) => { cache["facility"] = val; });
    await ReplyMessageController.all().then((val) => { cache["replyMessage"] = val; });
}

// 各テーブルをDBに一括保存する（削除はしない）
export async function saveAll() {
    var connection = await DbStore.createConnection();
    
    // 各テーブルの保存
    await connection.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(cache["character"]);
        await transactionalEntityManager.save(cache["parameter"]);
        await transactionalEntityManager.save(cache["facility"]);
        await transactionalEntityManager.save(cache["replyMessage"]);
    });
}