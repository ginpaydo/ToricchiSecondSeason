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
const ReplyMessage_1 = require("../models/ReplyMessage");
const DbStore_1 = require("../DbStore");
class ReplyMessageController {
    // GET /replyMessage
    // 全件取得（offset, limitをパラメータに受け取ることも可能）
    static all() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield DbStore_1.default.createConnection();
                let repository = connection.getRepository(ReplyMessage_1.default);
                // 存在チェック
                const allData = yield repository.find();
                resolve(allData);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    // GET /replyMessage/{id}
    // 指定したIDのタスクを取得する
    static get(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                const connection = yield DbStore_1.default.createConnection();
                let repository = connection.getRepository(ReplyMessage_1.default);
                // 存在チェック
                const result = yield repository.findOne(id);
                if (!result) {
                    reject({
                        code: 404,
                        message: '指定IDが見つかりませんでした'
                    });
                }
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    // POST /replyMessage
    // タスクを登録する
    static add(param) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let data = param;
            let result;
            try {
                const connection = yield DbStore_1.default.createConnection();
                let repository = connection.getRepository(ReplyMessage_1.default);
                result = yield repository.save(data);
            }
            catch (err) {
                reject(err);
            }
            resolve(result);
        }));
    }
    // PUT /replyMessage/{id}
    // 指定したIDのタスクを更新する
    static update(id, param) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let data = param;
            let result;
            try {
                const connection = yield DbStore_1.default.createConnection();
                let repository = connection.getRepository(ReplyMessage_1.default);
                // 存在チェック
                const exist = yield repository.findOne(data.id);
                if (!exist) {
                    reject({
                        code: 404,
                        message: '指定IDが見つかりませんでした'
                    });
                }
                // 更新
                result = yield repository.save(data);
            }
            catch (err) {
                reject(err);
            }
            resolve(result);
        }));
    }
    // DELETE /replyMessage/{id}
    // 指定したIDのタスクを削除する
    static delete(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                const connection = yield DbStore_1.default.createConnection();
                let repository = connection.getRepository(ReplyMessage_1.default);
                // 存在チェック
                const exist = yield repository.findOne(id);
                if (!exist) {
                    reject({
                        code: 404,
                        message: '指定IDが見つかりませんでした'
                    });
                }
                // 削除
                result = yield repository.remove(exist);
            }
            catch (err) {
                reject(err);
            }
            resolve(result);
        }));
    }
}
exports.default = ReplyMessageController;
//# sourceMappingURL=ReplyMessagesController.js.map