import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Charactersテーブル
// 使用者の情報保存
@Entity("Characters")
export default class Character {
    // 通し番号
    // PKだがDiscordIDを使うので自動インクリメントしない
    @Column({
        primary: true,
        type: 'varchar',
        comment: 'DiscordID',
        length: 20,
    })
    id: number;
    
    // 名前
    @Column({
        name: 'Name',
        type: 'varchar',
        comment: '名前',
        length: 50,
        default: '何か設定しなさい'
    })
    name: string;
    
    // 好感度
    @Column({
        name: 'Like',
        type: 'int',
        comment: '好感度',
        default: 0
    })
    like: number;

    // 作成日
    @CreateDateColumn({
        name: 'CreatedAt',
        comment: '作成日'
    })
    readonly createdAt: Date;

    // 更新日
    @UpdateDateColumn({
        name: 'UpdatedAt',
        comment: '更新日'
    })
    readonly updatedAt: Date;
}