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
exports.CreateClassDto = void 0;
const class_validator_1 = require("class-validator");
class CreateClassDto {
    name;
    code;
    teacherId;
    schedule;
}
exports.CreateClassDto = CreateClassDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome da turma é obrigatório.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O código da turma é obrigatório.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do professor responsável é obrigatório.' }),
    (0, class_validator_1.IsUUID)('4', { message: 'O ID do professor deve ser um UUID válido.' }),
    __metadata("design:type", String)
], CreateClassDto.prototype, "teacherId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O horário da turma é obrigatório.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassDto.prototype, "schedule", void 0);
//# sourceMappingURL=create-class.dto.js.map