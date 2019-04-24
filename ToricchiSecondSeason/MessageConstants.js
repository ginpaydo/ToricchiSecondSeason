"use strict";
// その他、システム定義
Object.defineProperty(exports, "__esModule", { value: true });
// テーブル名
exports.characterTable = "character";
exports.parameterTable = "parameter";
exports.facilityTable = "facility";
exports.replyMessageTable = "replyMessage";
exports.speechTable = "speech";
// メッセージ判定の時に除外する文字リスト
exports.trimList = [' ', '、', ',', '。', '\n', '　', '・', '･', '.'];
// ヘルプ表示の時に除外する文字リスト
exports.helpTrimList = ['^', '$'];
//# sourceMappingURL=MessageConstants.js.map