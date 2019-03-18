import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Parametersテーブル
// パラメータ
@Entity("Parameters")
export default class Parameter {
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
    
    // 値
    @Column({
        name: 'Value',
        type: 'varchar',
        comment: '値',
        length: 50,
        default: '何か設定しなさい'
    })
    value: string;

    // 好感度による表示
    @Column({
        name: 'VisibleLevel',
        type: 'int',
        comment: '好感度による表示',
        default: 0
    })
    visibleLevel: number;

    // 表示するパラメータ名
    @Column({
        name: 'Display',
        type: 'varchar',
        comment: '表示するパラメータ名',
        default: '何か設定しなさい'
    })
    display: string;

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