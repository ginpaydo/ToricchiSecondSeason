"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
// ReplyMessagesテーブル
// 応答メッセージ
let ReplyMessage = class ReplyMessage {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
    }),
    __metadata("design:type", Number)
], ReplyMessage.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'FriendlyPoint',
        type: 'int',
        comment: '好感度増減値',
        nullable: true
    }),
    __metadata("design:type", Number)
], ReplyMessage.prototype, "friendlyPoint", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Word',
        type: 'varchar',
        comment: '応答キーワード',
        length: 100,
        nullable: true
    }),
    __metadata("design:type", String)
], ReplyMessage.prototype, "word", void 0);
__decorate([
    typeorm_1.Column({
        name: 'RequirePointMin',
        type: 'int',
        comment: '応答好感度最小値',
        nullable: true
    }),
    __metadata("design:type", Number)
], ReplyMessage.prototype, "requirePointMin", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Reply',
        type: 'varchar',
        comment: '応答内容',
        length: 200,
        nullable: true
    }),
    __metadata("design:type", String)
], ReplyMessage.prototype, "reply", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Function',
        type: 'varchar',
        comment: '呼び出す関数名',
        nullable: true
    }),
    __metadata("design:type", String)
], ReplyMessage.prototype, "function", void 0);
__decorate([
    typeorm_1.Column({
        name: 'IsVisible',
        type: 'boolean',
        comment: '説明表示するか',
        default: true
    }),
    __metadata("design:type", Boolean)
], ReplyMessage.prototype, "isVisible", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Comment',
        type: 'varchar',
        comment: '説明',
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], ReplyMessage.prototype, "comment", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        name: 'CreatedAt',
        comment: '作成日'
    }),
    __metadata("design:type", Date)
], ReplyMessage.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        name: 'UpdatedAt',
        comment: '更新日'
    }),
    __metadata("design:type", Date)
], ReplyMessage.prototype, "updatedAt", void 0);
ReplyMessage = __decorate([
    typeorm_1.Entity("ReplyMessages")
], ReplyMessage);
exports.default = ReplyMessage;
//# sourceMappingURL=ReplyMessage.js.map