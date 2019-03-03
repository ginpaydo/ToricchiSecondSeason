
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
        type: 'string',
        comment: '名前',
        length: 50,
        default: '何か設定しなさい'
    })
    name: string;
    
    // 値
    @Column({
        name: 'Value',
        type: 'int',
        comment: '値',
        default: 0
    })
    value: number;
    
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