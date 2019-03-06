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
        type: 'text',
        comment: '名前',
        length: 50,
        default: '何か設定しなさい'
    })
    name: string;
    
    // 値
    @Column({
        name: 'Value',
        type: 'text',
        comment: '値',
        length: 50,
        default: '何か設定しなさい'
    })
    value: string;
    
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

    intValue(): number {
        return parseInt(this.value);
    }
}