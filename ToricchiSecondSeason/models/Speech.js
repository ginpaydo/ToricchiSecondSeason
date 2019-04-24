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
// Speechテーブル
// BOTの台詞やメッセージの格納
let Speech = class Speech {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
    }),
    __metadata("design:type", Number)
], Speech.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'no',
        type: 'varchar',
        comment: '台詞番号：複数行の台詞は同じ番号を指定する',
        length: 10,
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], Speech.prototype, "no", void 0);
__decorate([
    typeorm_1.Column({
        name: 'dataOrder',
        type: 'int',
        comment: '台詞番号が同じメッセージの並び順',
        default: 0
    }),
    __metadata("design:type", Number)
], Speech.prototype, "dataOrder", void 0);
__decorate([
    typeorm_1.Column({
        name: 'data',
        type: 'varchar',
        comment: '台詞',
        length: 255,
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], Speech.prototype, "data", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        name: 'CreatedAt',
        comment: '作成日'
    }),
    __metadata("design:type", Date)
], Speech.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        name: 'UpdatedAt',
        comment: '更新日'
    }),
    __metadata("design:type", Date)
], Speech.prototype, "updatedAt", void 0);
Speech = __decorate([
    typeorm_1.Entity("Speechs")
], Speech);
exports.default = Speech;
//# sourceMappingURL=Speech.js.map