import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

// Speechテーブル
// BOTの台詞やメッセージの格納
@Entity("Speechs")
export default class Speech {
    // 通し番号
    @PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
    })
    id: number;

    // 台詞番号
    @Column({
        name: 'no',
        type: 'varchar',
        comment: '台詞番号：複数行の台詞は同じ番号を指定する',
        length: 10,
        default: '何か設定しなさい'
    })
    no: string;
    
    // 台詞番号が同じメッセージの並び順
    @Column({
        name: 'dataOrder',
        type: 'int',
        comment: '台詞番号が同じメッセージの並び順',
        default: 0
    })
    dataOrder: number;

    // 台詞番号
    @Column({
        name: 'data',
        type: 'varchar',
        comment: '台詞',
        length: 255,
        default: '何か設定しなさい'
    })
    data: string;

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