import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Facilitiesテーブル
// 購入する施設
@Entity("Facilities")
export default class Facility {
    // 通し番号
    @PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
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
    
    // 基本価格
    @Column({
        name: 'BasePrice',
        type: 'int',
        comment: '基本価格',
        default: 0
    })
    basePrice: number;
    
    // 基本利益
    @Column({
        name: 'BaseIncome',
        type: 'int',
        comment: '基本利益',
        default: 0
    })
    baseIncome: number;
    
    // レベル
    @Column({
        name: 'Level',
        type: 'int',
        comment: 'レベル',
        default: 0
    })
    level: number;
    
    // 現在価格
    @Column({
        name: 'CurrentPrice',
        type: 'int',
        comment: '現在価格',
        default: 0
    })
    currentPrice: number;
    
    // 現在の生産量
    @Column({
        name: 'CurrentIncome',
        type: 'int',
        comment: '現在の生産量',
        default: 0
    })
    currentIncome: number;
    
    // 説明
    @Column({
        name: 'Comment',
        type: 'varchar',
        comment: '説明',
        length: 100,
        default: '何か設定しなさい'
    })
    comment: string;

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