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
const ReplyMessage_1 = require("./models/ReplyMessage");
const Parameter_1 = require("./models/Parameter");
const Facility_1 = require("./models/Facility");
const Character_1 = require("./models/Character");
const ReplyMessagesController_1 = require("./controllers/ReplyMessagesController");
const FacilitiesController_1 = require("./controllers/FacilitiesController");
const ParametersController_1 = require("./controllers/ParametersController");
const CharactersController_1 = require("./controllers/CharactersController");
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
        Character_1.default,
        Facility_1.default,
        Parameter_1.default,
        ReplyMessage_1.default
    ],
    // Model変更をデータベースのテーブル定義に反映する
    synchronize: true
};
exports.default = DbStore;
// とりっっちのデータキャッシュ
exports.cache = {};
//export var characterCache = null;
//export var parameterCache = null;
//export var facilityCache = null;
//export var replyMessageCache = null;
// 各テーブルをキャッシュする
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        yield CharactersController_1.default.all().then((val) => {
            exports.cache["character"] = val;
        });
        yield ParametersController_1.default.all().then((val) => {
            exports.cache["parameter"] = val;
        });
        yield FacilitiesController_1.default.all().then((val) => {
            exports.cache["facility"] = val;
        });
        yield ReplyMessagesController_1.default.all().then((val) => {
            exports.cache["replyMessage"] = val;
        });
    });
}
exports.initialize = initialize;
// 各テーブルをDBに一括保存する（削除はしない）
function saveAll() {
    return __awaiter(this, void 0, void 0, function* () {
        var connection = yield DbStore.createConnection();
        // 各テーブルの保存
        yield connection.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
            Object.keys(exports.cache).forEach(function (key) {
                return __awaiter(this, void 0, void 0, function* () {
                    var val = this[key]; // this は obj
                    yield transactionalEntityManager.save(val);
                });
            }, exports.cache);
            //await transactionalEntityManager.save(parameterCache);
            //await transactionalEntityManager.save(characterCache);
        }));
    });
}
exports.saveAll = saveAll;
//# sourceMappingURL=DbStore.js.map