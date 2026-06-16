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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const classes_service_1 = require("./classes.service");
const decorators_1 = require("../common/decorators");
const user_entity_1 = require("../users/entities/user.entity");
let ClassesController = class ClassesController {
    classesService;
    constructor(classesService) {
        this.classesService = classesService;
    }
    async create(dto, user) {
        const teacherId = user.role === 'admin' ? dto.teacherId : user.id;
        return this.classesService.create({
            name: dto.name,
            code: dto.code,
            schedule: dto.schedule,
            teacherId: teacherId,
        });
    }
    async addStudent(classId, dto) {
        return this.classesService.addStudent(classId, dto.studentId);
    }
    async findAll(user) {
        return this.classesService.findAll(user);
    }
    async findByTeacher(teacherId) {
        return this.classesService.findAll({ id: teacherId, role: 'professor' });
    }
    async findOne(id) {
        return this.classesService.findOne(id);
    }
    async remove(id) {
        return this.classesService.remove(id);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/add-student'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "addStudent", null);
__decorate([
    (0, common_1.Get)(['', 'all']),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ALUNO),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('teacher/:id'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "findByTeacher", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ALUNO),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "remove", null);
exports.ClassesController = ClassesController = __decorate([
    (0, common_1.Controller)('classes'),
    __metadata("design:paramtypes", [classes_service_1.ClassesService])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map