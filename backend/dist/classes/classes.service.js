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
    classRepo;
    constructor(classRepo) {
        this.classRepo = classRepo;
    }
    async create(dto) {
        try {
            const novaTurma = this.classRepo.create({
                name: dto.name,
                code: dto.code,
                schedule: dto.schedule,
                teacherId: dto.teacherId,
                studentIds: [],
            });
            return await this.classRepo.save(novaTurma);
        }
        catch (error) {
            console.error('❌ [ERRO AO CRIAR TURMA] Falha ao salvar no SQLite:', error);
            throw new Error(`Não foi possível salvar a turma: ${error.message}`);
        }
    }
    async addStudent(classId, studentId) {
        try {
            const turma = await this.classRepo.findOne({ where: { id: classId } });
            if (!turma)
                throw new common_1.NotFoundException('Turma não localizada.');
            let alunosAtuais = [];
            if (turma.studentIds) {
                if (typeof turma.studentIds === 'string') {
                    try {
                        alunosAtuais = JSON.parse(turma.studentIds);
                    }
                    catch {
                        alunosAtuais = [];
                    }
                }
                else if (Array.isArray(turma.studentIds)) {
                    alunosAtuais = turma.studentIds;
                }
            }
            const idLimpo = String(studentId).trim().toLowerCase();
            const jaMatriculado = alunosAtuais.map(id => String(id).trim().toLowerCase()).includes(idLimpo);
            if (jaMatriculado) {
                return turma;
            }
            alunosAtuais.push(studentId);
            turma.studentIds = alunosAtuais;
            return await this.classRepo.save(turma);
        }
        catch (error) {
            console.error('❌ [ERRO MATRÍCULA] Falha ao injetar aluno no array:', error);
            throw new Error(`Erro ao matricular: ${error.message}`);
        }
    }
    async findAll(user) {
        try {
            const todasAsTurmas = await this.classRepo.find();
            if (!user)
                return todasAsTurmas;
            if (user.role === 'admin') {
                return todasAsTurmas;
            }
            if (user.role === 'aluno') {
                return todasAsTurmas.filter(turma => {
                    if (!turma.studentIds)
                        return false;
                    let ids = [];
                    try {
                        if (typeof turma.studentIds === 'string') {
                            const parsed = JSON.parse(turma.studentIds);
                            ids = Array.isArray(parsed) ? parsed : [turma.studentIds];
                        }
                        else if (Array.isArray(turma.studentIds)) {
                            ids = turma.studentIds;
                        }
                    }
                    catch {
                        ids = String(turma.studentIds).split(',');
                    }
                    return ids.map(id => String(id).trim().toLowerCase()).includes(String(user.id).trim().toLowerCase());
                });
            }
            if (user.id) {
                return todasAsTurmas.filter(turma => String(turma.teacherId).trim() === String(user.id).trim());
            }
            return [];
        }
        catch (error) {
            console.error('❌ [ERRO LISTAGEM] Falha ao buscar disciplinas:', error.message);
            return [];
        }
    }
    async findOne(id) {
        try {
            const turma = await this.classRepo.findOne({ where: { id } });
            if (!turma) {
                throw new common_1.NotFoundException(`Turma com o ID ${id} não localizada.`);
            }
            return turma;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao buscar turma: ${error.message}`);
        }
    }
    async remove(id) {
        const turma = await this.findOne(id);
        return await this.classRepo.remove(turma);
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClassesService);
//# sourceMappingURL=classes.service.js.map