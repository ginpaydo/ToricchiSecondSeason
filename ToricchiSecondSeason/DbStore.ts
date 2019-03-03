import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import ReplyMessage from './models/ReplyMessage';
import Parameter from './models/Parameter';
import Facility from './models/Facility';
import Character from './models/Character';

export default class DbStore {
    private static _conn: Connection;

    // データベースの設定
    public static connectionOptions: ConnectionOptions = {
        // 設定を書くこと
        // 詳しくはここ！
        // https://typeorm.io/
        type: "sqlite",
        database: `./data/data.sqlite`,
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