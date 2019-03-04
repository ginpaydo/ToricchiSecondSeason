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
// Facilitiesテーブル
// 購入する施設
let Facility = class Facility {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
    }),
    __metadata("design:type", Number)
], Facility.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Name',
        type: 'text',
        comment: '名前',
        length: 50,
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], Facility.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: 'BasePrice',
        type: 'int',
        comment: '基本価格',
        default: 0
    }),
    __metadata("design:type", Number)
], Facility.prototype, "basePrice", void 0);
__decorate([
    typeorm_1.Column({
        name: 'BaseIncome',
        type: 'int',
        comment: '基本利益',
        default: 0
    }),
    __metadata("design:type", Number)
], Facility.prototype, "baseIncome", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Level',
        type: 'int',
        comment: 'レベル',
        default: 0
    }),
    __metadata("design:type", Number)
], Facility.prototype, "level", void 0);
__decorate([
    typeorm_1.Column({
        name: 'CurrentPrice',
        type: 'int',
        comment: '現在価格',
        default: 0
    }),
    __metadata("design:type", Number)
], Facility.prototype, "currentPrice", void 0);
__decorate([
    typeorm_1.Column({
        name: 'CurrentIncome',
        type: 'int',
        comment: '現在の生産量',
        default: 0
    }),
    __metadata("design:type", Number)
], Facility.prototype, "currentIncome", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Comment',
        type: 'text',
        comment: '説明',
        length: 100,
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], Facility.prototype, "comment", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        name: 'CreatedAt',
        type: 'date',
        comment: '作成日'
    }),
    __metadata("design:type", Date)
], Facility.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        name: 'UpdatedAt',
        type: 'date',
        comment: '更新日'
    }),
    __metadata("design:type", Date)
], Facility.prototype, "updatedAt", void 0);
Facility = __decorate([
    typeorm_1.Entity("Facilities")
], Facility);
exports.default = Facility;
//# sourceMappingURL=Facility.js.map