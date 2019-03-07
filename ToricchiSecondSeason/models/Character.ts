import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Charactersテーブル
// 使用者の情報保存
@Entity("Characters")
export default class Character {
    // 通し番号
    // PKだがDiscordIDを使うので自動インクリメントしない
    @Column({
        primary: true,
        type: 'text',
        comment: 'DiscordID',
        length: 20,
    })
    id: number;
    
    // 名前
    @Column({
        name: 'Name',
        type: 'text',
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
        type: 'date',
        comment: '作成日'
    })
    readonly createdAt: Date;
    
    // 更新日
    @UpdateDateColumn({
        name: 'UpdatedAt',
        type: 'date',
        comment: '更新日'
    })
    readonly updatedAt: Date;
    
}