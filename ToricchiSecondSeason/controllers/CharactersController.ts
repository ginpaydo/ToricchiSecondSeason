import Character from '../models/Character';
import DbStore from '../DbStore';

export default class CharacterController {

    // GET /character
    // 全件取得（offset, limitをパラメータに受け取ることも可能）
    static all(): Promise<Character[]> {

        return new Promise(async (resolve, reject) => {
            try {
                const connection = await DbStore.createConnection();
                let repository = connection.getRepository(Character);

                // 存在チェック
                const allData = await repository.find();
                resolve(allData);
            } catch (err) {
                reject(err);
            }
        });
    }

    // GET /character/{id}
    // 指定したIDのタスクを取得する
    static get(id: number): Promise<Character> {
        return new Promise(async (resolve, reject) => {
            let result: Character;

            try {
                const connection = await DbStore.createConnection();
                let repository = connection.getRepository(Character);

                // 存在チェック
                const result = await repository.findOne(id);
                if (!result) {
                    reject({
                        code: 404,
                        message: '指定IDが見つかりませんでした'
                    })
                }
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    // POST /character
    // タスクを登録する
    static add(param: Character): Promise<Character> {
        
        return new Promise(async (resolve, reject) => {
            let data = param;
            let result: Character;

            try {
                const connection = await DbStore.createConnection();
                let repository = connection.getRepository(Character);
                result = await repository.save(data);
            } catch (err) {
                reject(err);
            }
            resolve(result);
        });
    }

    // PUT /character/{id}
    // 指定したIDのタスクを更新する
    static update(id: number, param: Character): Promise<Character> {
        return new Promise(async (resolve, reject) => {
            let data = param;
            let result: Character;

            try {
                const connection = await DbStore.createConnection();
                let repository = connection.getRepository(Character);

                // 存在チェック
                const exist = await repository.findOne(data.id);
                if (!exist) {
                    reject({
                        code: 404,
                        message: '指定IDが見つかりませんでした'
                    })
                }
                // 更新
                result = await repository.save(data);
            } catch (err) {
                reject(err);
            }
            resolve(result);
        });
    }

    // DELETE /character/{id}
    // 指定したIDのタスクを削除する
    static delete(id: number): Promise<Character> {
        return new Promise(async (resolve, reject) => {
            let result: Character;

            try {
                const connection = await DbStore.createConnection();
                let repository = connection.getRepository(Character);

                // 存在チェック
                const exist = await repository.findOne(id);
                if (!exist) {
                    reject({
                        code: 404,
                        message: '指定IDが見つかりませんでした'
                    })
                }
                // 削除
                result = await repository.remove(exist);
            } catch (err) {
                reject(err);
            }
            resolve(result);
        });
    }
}