"use strict";
// メッセージ定義
Object.defineProperty(exports, "__esModule", { value: true });
// 処理失敗メッセージ
exports.failedMessage = '処理に失敗しました:';
// 初期状態メッセージ
exports.initialMessage = '初期状態なので、データを登録してください。';
// キャッシュメッセージ
exports.cacheMessage = 'データのキャッシュを行います。';
// 起動完了メッセージ
exports.startupMessage = '起動しました。';
// 新規利用者作成メッセージ
exports.makeCharacterMessage = 'この利用者が見つかりませんでした。データを作成します。:';
// DB関連エラーメッセージ
exports.dbErrMessage = 'データベース処理に失敗しました。';
// その他、システム定義
// メッセージ判定の時に除外する文字リスト
exports.trimList = [' ', '、', ',', '。', '\n', '　', '・', '･', '.'];
// ヘルプ表示の時に除外する文字リスト
exports.helpTrimList = ['^', '$'];
// デフォルトBOT名
exports.defaultBotName1 = "とり";
exports.defaultBotName2 = "っ";
exports.defaultBotName3 = "ち";
//# sourceMappingURL=MessageConstants.js.map