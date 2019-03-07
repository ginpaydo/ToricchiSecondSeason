// メッセージ定義

// 処理失敗メッセージ
export const failedMessage = '処理に失敗しました:';

// 初期状態メッセージ
export const initialMessage = '初期状態なので、データを登録してください。';

// キャッシュメッセージ
export const cacheMessage = 'データのキャッシュを行います。';

// 起動完了メッセージ
export const startupMessage = '起動しました。';

// 新規利用者作成メッセージ
export const makeCharacterMessage = 'この利用者が見つかりませんでした。データを作成します。:';

// DB関連エラーメッセージ
export const dbErrMessage = 'データベース処理に失敗しました。';

// メッセージ判定の時に除外する文字リスト
export const trimList = [' ', '、', ',', '。', '\n', '　', '・', '･', '.'];

// ヘルプ表示の時に除外する文字リスト
export const helpTrimList = ['^', '$'];