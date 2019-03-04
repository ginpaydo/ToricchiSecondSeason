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
// Charactersテーブル
// 使用者の情報保存
let Character = class Character {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
    }),
    __metadata("design:type", Number)
], Character.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Name',
        type: 'text',
        comment: '名前',
        length: 50,
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], Character.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Like',
        type: 'int',
        comment: '好感度',
        default: 0
    }),
    __metadata("design:type", Number)
], Character.prototype, "like", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        name: 'CreatedAt',
        type: 'date',
        comment: '作成日'
    }),
    __metadata("design:type", Date)
], Character.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        name: 'UpdatedAt',
        type: 'date',
        comment: '更新日'
    }),
    __metadata("design:type", Date)
], Character.prototype, "updatedAt", void 0);
Character = __decorate([
    typeorm_1.Entity("Characters")
], Character);
exports.default = Character;
//# sourceMappingURL=Character.js.map