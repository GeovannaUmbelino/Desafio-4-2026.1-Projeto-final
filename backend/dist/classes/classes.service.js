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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_entity_1 = require("./entities/class.entity");
let ClassesService = class ClassesService {
    classRepository;
    constructor(classRepository) {
        this.classRepository = classRepository;
    }
    async create(dto) {
        const newClass = this.classRepository.create({
            ...dto,
            studentIds: [],
        });
        return this.classRepository.save(newClass);
    }
    async findAll() {
        return this.classRepository.find();
    }
    async findOne(id) {
        const targetClass = await this.classRepository.findOne({ where: { id } });
        if (!targetClass) {
            throw new common_1.NotFoundException('Turma não encontrada.');
        }
        return targetClass;
    }
    async findByTeacher(teacherId) {
        return this.classRepository.find({ where: { teacherId } });
    }
    async update(id, dto) {
        const targetClass = await this.classRepository.findOne({ where: { id } });
        if (!targetClass) {
            throw new common_1.NotFoundException('Turma não encontrada para atualização.');
        }
        Object.assign(targetClass, dto);
        return this.classRepository.save(targetClass);
    }
    async remove(id) {
        const targetClass = await this.classRepository.findOne({ where: { id } });
        if (!targetClass) {
            throw new common_1.NotFoundException('Turma não encontrada para exclusão.');
        }
        await this.classRepository.remove(targetClass);
    }
    async enrollStudent(classId, studentId) {
        const targetClass = await this.classRepository.findOne({ where: { id: classId } });
        if (!targetClass) {
            throw new common_1.NotFoundException('Turma não encontrada.');
        }
        if (!targetClass.studentIds) {
            targetClass.studentIds = [];
        }
        if (!targetClass.studentIds.includes(studentId)) {
            targetClass.studentIds.push(studentId);
        }
        return this.classRepository.save(targetClass);
    }
    async findByStudent(studentId) {
        const allClasses = await this.classRepository.find();
        return allClasses.filter((c) => c.studentIds && c.studentIds.includes(studentId));
    }
    async getClassDashboardData(id) {
        const targetClass = await this.classRepository.findOne({ where: { id } });
        if (!targetClass) {
            throw new common_1.NotFoundException('Turma não encontrada.');
        }
        return {
            id: targetClass.id,
            name: targetClass.name,
            code: targetClass.code,
            schedule: targetClass.schedule,
            totalStudents: targetClass.studentIds ? targetClass.studentIds.length : 0,
            studentIds: targetClass.studentIds || [],
        };
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClassesService);
//# sourceMappingURL=classes.service.js.map