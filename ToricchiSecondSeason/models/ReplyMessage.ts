import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// ReplyMessagesテーブル
// 応答メッセージ
@Entity("ReplyMessages")
export default class ReplyMessage {
    // 通し番号
    @PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
    })
    id: number;
    
    // 好感度増減値
    @Column({
        name: 'FriendlyPoint',
        type: 'int',
        comment: '好感度増減値',
        nullable: true
    })
    friendlyPoint: number;
    
    // 応答キーワード
    @Column({
        name: 'Word',
        type: 'varchar',
        comment: '応答キーワード',
        length: 100,
        nullable: true
    })
    word: string;
    
    // 応答好感度最小値
    @Column({
        name: 'RequirePointMin',
        type: 'int',
        comment: '応答好感度最小値',
        nullable: true
    })
    requirePointMin: number;
    
    // 応答内容
    @Column({
        name: 'Reply',
        type: 'varchar',
        comment: '応答内容',
        length: 200,
        nullable: true
    })
    reply: string;
    
    // 呼び出す関数名
    @Column({
        name: 'Function',
        type: 'varchar',
        comment: '呼び出す関数名',
        nullable: true
    })
    function: string;
    
    // 説明表示するか
    @Column({
        name: 'IsVisible',
        type: 'boolean',
        comment: '説明表示するか',
        default: true
    })
    isVisible: boolean;
    
    // 説明
    @Column({
        name: 'Comment',
        type: 'varchar',
        comment: '説明',
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