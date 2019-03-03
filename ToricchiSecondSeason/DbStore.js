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
const typeorm_1 = require("typeorm");
const Task_1 = require("./models/Task"); // TODO:追加すること
const Bask_1 = require("./models/Bask");
class DbStore {
    // 接続（シングルトン）
    static createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._conn) {
                this._conn = yield typeorm_1.createConnection(this.connectionOptions);
            }
            return this._conn;
        });
    }
}
// データベースの設定
DbStore.connectionOptions = {
    // 設定を書くこと
    // 詳しくはここ！
    // https://typeorm.io/
    type: "sqlite",
    database: `./data/data.sqlite`,
    entities: [
        // TODO:テーブルクラスを全てここに列挙すること
        Task_1.default,
        Bask_1.default
    ],
    // Model変更をデータベースのテーブル定義に反映する
    synchronize: true
};
exports.default = DbStore;
//# sourceMappingURL=DbStore.js.map