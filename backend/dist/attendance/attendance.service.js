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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const class_entity_1 = require("../classes/entities/class.entity");
const user_entity_1 = require("../users/entities/user.entity");
let AttendanceService = class AttendanceService {
    attendanceRepo;
    classRepo;
    userRepo;
    constructor(attendanceRepo, classRepo, userRepo) {
        this.attendanceRepo = attendanceRepo;
        this.classRepo = classRepo;
        this.userRepo = userRepo;
    }
    async create(dto) {
        const classExists = await this.classRepo.findOne({
            where: { id: dto.classId },
        });
        if (!classExists) {
            throw new common_1.NotFoundException(`Turma com ID "${dto.classId}" não encontrada.`);
        }
        const attendance = this.attendanceRepo.create({
            classId: dto.classId,
            date: dto.date,
            presentStudents: JSON.stringify(dto.presentStudents),
        });
        return this.attendanceRepo.save(attendance);
    }
    async submitAttendance(payload, professor) {
        const classExists = await this.classRepo.findOne({
            where: { id: payload.classId },
        });
        if (!classExists) {
            throw new common_1.NotFoundException(`Turma com ID "${payload.classId}" não encontrada.`);
        }
        const presentIds = payload.records
            .filter((r) => r.present)
            .map((r) => r.studentId);
        const attendance = this.attendanceRepo.create({
            classId: payload.classId,
            date: payload.date,
            presentStudents: JSON.stringify(presentIds),
        });
        const saved = await this.attendanceRepo.save(attendance);
        console.log(`[Chamada] Professor ${professor.name} registrou chamada na turma ` +
            `${classExists.name} em ${payload.date}. ` +
            `Presentes: ${presentIds.length}/${payload.records.length}`);
        return saved;
    }
    async getDashboardStats(requester) {
        let turmas;
        if (requester.role === user_entity_1.UserRole.ADMIN) {
            turmas = await this.classRepo.find();
        }
        else {
            turmas = await this.classRepo.find({
                where: { teacherId: requester.id },
            });
        }
        const totalTurmas = turmas.length;
        if (totalTurmas === 0) {
            return { totalAlunos: 0, totalTurmas: 0, mediaPresenca: 0, baixaFrequencia: [] };
        }
        const todosStudentIds = new Set();
        turmas.forEach((t) => {
            (t.studentIds ?? []).forEach((id) => todosStudentIds.add(id));
        });
        const totalAlunos = todosStudentIds.size;
        const classIds = turmas.map((t) => t.id);
        const todasChamadas = await this.attendanceRepo
            .createQueryBuilder('a')
            .where('a.classId IN (:...ids)', { ids: classIds })
            .getMany();
        if (todasChamadas.length === 0) {
            return { totalAlunos, totalTurmas, mediaPresenca: 0, baixaFrequencia: [] };
        }
        const presencaCount = {};
        todosStudentIds.forEach((sid) => {
            presencaCount[sid] = { presencas: 0, totalAulas: 0 };
        });
        const chamadasPorTurma = {};
        todasChamadas.forEach((c) => {
            if (!chamadasPorTurma[c.classId])
                chamadasPorTurma[c.classId] = [];
            chamadasPorTurma[c.classId].push(c);
        });
        turmas.forEach((turma) => {
            const chamadas = chamadasPorTurma[turma.id] ?? [];
            const alunosDaTurma = turma.studentIds ?? [];
            chamadas.forEach((chamada) => {
                let presentes = [];
                try {
                    presentes = JSON.parse(chamada.presentStudents);
                }
                catch { }
                alunosDaTurma.forEach((sid) => {
                    if (!presencaCount[sid])
                        presencaCount[sid] = { presencas: 0, totalAulas: 0 };
                    presencaCount[sid].totalAulas += 1;
                    if (presentes.includes(sid))
                        presencaCount[sid].presencas += 1;
                });
            });
        });
        const porcentagens = [];
        const baixaFrequencia = [];
        Object.entries(presencaCount).forEach(([alunoId, stat]) => {
            if (stat.totalAulas === 0)
                return;
            const pct = Math.round((stat.presencas / stat.totalAulas) * 100);
            porcentagens.push(pct);
            if (pct < 75) {
                baixaFrequencia.push({
                    alunoId,
                    presencas: stat.presencas,
                    totalAulas: stat.totalAulas,
                    porcentagem: pct,
                });
            }
        });
        const mediaPresenca = porcentagens.length > 0
            ? Math.round(porcentagens.reduce((a, b) => a + b, 0) / porcentagens.length)
            : 0;
        baixaFrequencia.sort((a, b) => a.porcentagem - b.porcentagem);
        return { totalAlunos, totalTurmas, mediaPresenca, baixaFrequencia };
    }
    async findAll() {
        return this.attendanceRepo.find({ relations: { class: true } });
    }
    async findByClass(classId, startDate, endDate) {
        if (startDate && endDate) {
            return this.attendanceRepo.find({
                where: { classId, date: (0, typeorm_2.Between)(startDate, endDate) },
                order: { date: 'DESC' },
            });
        }
        return this.attendanceRepo.find({
            where: { classId },
            order: { date: 'DESC' },
        });
    }
    async getAttendanceReport(classId) {
        const attendances = await this.attendanceRepo.find({
            where: { classId },
            order: { date: 'ASC' },
        });
        const totalAulas = attendances.length;
        if (totalAulas === 0) {
            return { classId, totalAulas: 0, mediaFrequenciaTurma: '0%', relatorioAlunos: [] };
        }
        const contagemPresencas = {};
        attendances.forEach((a) => {
            try {
                JSON.parse(a.presentStudents).forEach((id) => {
                    contagemPresencas[id] = (contagemPresencas[id] ?? 0) + 1;
                });
            }
            catch { }
        });
        let soma = 0;
        const relatorioAlunos = Object.entries(contagemPresencas).map(([alunoId, presencas]) => {
            const pct = Math.round((presencas / totalAulas) * 100);
            soma += pct;
            return {
                alunoId,
                presencas,
                faltas: totalAulas - presencas,
                porcentagemFrequencia: pct,
                status: pct >= 75 ? 'Regular' : 'Risco de Reprovação',
            };
        });
        const media = relatorioAlunos.length > 0 ? Math.round(soma / relatorioAlunos.length) : 0;
        return { classId, totalAulas, mediaFrequenciaTurma: `${media}%`, relatorioAlunos };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map