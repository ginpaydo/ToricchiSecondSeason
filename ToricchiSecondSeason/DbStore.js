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
const MessageConstants_1 = require("./MessageConstants");
const Speech_1 = require("./models/Speech");
const SpeechController_1 = require("./controllers/SpeechController");
// 設定ファイル
var config = require('config');
console.log("あんあん");
console.log(config.database.type);
class DbStore {
    // 接続（シングルトン）
    static createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("いんいん");
            console.log(config.database.type);
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
    type: config.database.type,
    database: config.database.database,
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    logging: config.database.logging,
    entities: [
        Character_1.default,
        Facility_1.default,
        Parameter_1.default,
        ReplyMessage_1.default,
        Speech_1.default
    ],
    // Model変更をデータベースのテーブル定義に反映する
    synchronize: config.database.synchronize
};
exports.default = DbStore;
// とりっっちのデータキャッシュ
exports.cache = {};
// 各テーブルをキャッシュする
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        yield CharactersController_1.default.all().then((val) => { exports.cache[MessageConstants_1.characterTable] = val; });
        yield ParametersController_1.default.all().then((val) => { exports.cache[MessageConstants_1.parameterTable] = val; });
        yield FacilitiesController_1.default.all().then((val) => { exports.cache[MessageConstants_1.facilityTable] = val; });
        yield ReplyMessagesController_1.default.all().then((val) => { exports.cache[MessageConstants_1.replyMessageTable] = val; });
        yield SpeechController_1.default.all().then((val) => { exports.cache[MessageConstants_1.speechTable] = val; });
        console.log(config.messages.cacheEnd);
    });
}
exports.initialize = initialize;
// 各テーブルをDBに一括保存する（削除はしない）
function saveAll() {
    return __awaiter(this, void 0, void 0, function* () {
        var connection = yield DbStore.createConnection();
        // 各テーブルの保存
        yield connection.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
            yield transactionalEntityManager.save(exports.cache[MessageConstants_1.characterTable]);
            yield transactionalEntityManager.save(exports.cache[MessageConstants_1.parameterTable]);
            yield transactionalEntityManager.save(exports.cache[MessageConstants_1.facilityTable]);
            yield transactionalEntityManager.save(exports.cache[MessageConstants_1.replyMessageTable]);
            yield transactionalEntityManager.save(exports.cache[MessageConstants_1.speechTable]);
        }));
    });
}
exports.saveAll = saveAll;
//# sourceMappingURL=DbStore.js.map