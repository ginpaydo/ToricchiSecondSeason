
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Charactersテーブル
// 使用者の情報保存
@Entity("Characters")
export default class Character {
    // 通し番号
    @PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
    })
    id: number;
    
    // 好感度増減値
    @Column({
        name: 'Name',
        type: 'string',
        comment: '好感度増減値',
        length: 50,
        default: '何か設定しなさい'
    })
    name: number;
    
    // 応答キーワード
    @Column({
        name: 'Like',
        type: 'int',
        comment: '応答キーワード',
        default: '0'
    })
    like: string;
    
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