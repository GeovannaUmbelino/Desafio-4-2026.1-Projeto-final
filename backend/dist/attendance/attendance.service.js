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
    async create(dto, user) {
        try {
            const novaChamada = this.attendanceRepo.create({
                classId: dto.classId,
                teacherId: user.id,
                studentsResult: dto.students || dto.studentsResult || [],
                date: dto.date || new Date().toISOString().split('T')[0],
            });
            return await this.attendanceRepo.save(novaChamada);
        }
        catch (error) {
            throw new Error(`Falha ao registrar chamada: ${error.message}`);
        }
    }
    async getDashboardStats(user) {
        try {
            const turmas = user.role === 'admin'
                ? await this.classRepo.find()
                : await this.classRepo.find({ where: { teacherId: user.id } });
            if (!turmas || turmas.length === 0) {
                return { totalAlunos: 0, totalTurmas: 0, mediaPresenca: 100, baixaFrequencia: [] };
            }
            const classIdsValidos = turmas.map(t => String(t.id).trim().toLowerCase());
            const todasAsChamadas = await this.attendanceRepo.find();
            const todosUsuarios = await this.userRepo.find();
            const todosAlunos = todosUsuarios.filter(u => u.role === 'aluno');
            const chamadasValidas = todasAsChamadas.filter(c => classIdsValidos.includes(String(c.classId).trim().toLowerCase()));
            let totalAlunosContados = 0;
            const mapaTurmasAlunos = {};
            turmas.forEach(t => {
                let matriculadosIds = [];
                if (t.studentIds) {
                    try {
                        if (typeof t.studentIds === 'string') {
                            matriculadosIds = JSON.parse(t.studentIds);
                        }
                        else if (Array.isArray(t.studentIds)) {
                            matriculadosIds = t.studentIds;
                        }
                    }
                    catch {
                        matriculadosIds = [];
                    }
                }
                mapaTurmasAlunos[String(t.id).trim().toLowerCase()] = matriculadosIds.map(id => String(id).trim().toLowerCase());
                totalAlunosContados += matriculadosIds.length;
            });
            let totalPresencas = 0;
            let totalRegistros = 0;
            const alunosAlerta = [];
            todosAlunos.forEach(aluno => {
                let presencasDoAluno = 0;
                let chamadasDoAluno = 0;
                let nomeMateriaExibicao = '';
                const alunoIdLimpo = String(aluno.id).trim().toLowerCase();
                chamadasValidas.forEach(chamada => {
                    const chamadaClassIdLimpo = String(chamada.classId).trim().toLowerCase();
                    const alunosDaTurma = mapaTurmasAlunos[chamadaClassIdLimpo] || [];
                    if (alunosDaTurma.includes(alunoIdLimpo)) {
                        let listaAlunos = [];
                        if (typeof chamada.studentsResult === 'string') {
                            try {
                                listaAlunos = JSON.parse(chamada.studentsResult);
                            }
                            catch {
                                listaAlunos = [];
                            }
                        }
                        else if (Array.isArray(chamada.studentsResult)) {
                            listaAlunos = chamada.studentsResult;
                        }
                        else if (chamada.studentsResult && typeof chamada.studentsResult === 'object') {
                            listaAlunos = Object.values(chamada.studentsResult);
                        }
                        const registro = listaAlunos.find((a) => String(a.id).trim().toLowerCase() === alunoIdLimpo ||
                            String(a.studentId).trim().toLowerCase() === alunoIdLimpo ||
                            String(a.name).toLowerCase().trim() === String(aluno.name).toLowerCase().trim());
                        if (registro) {
                            chamadasDoAluno++;
                            const correspondenteTurma = turmas.find(t => String(t.id).trim().toLowerCase() === chamadaClassIdLimpo);
                            if (correspondenteTurma)
                                nomeMateriaExibicao = correspondenteTurma.name;
                            if (registro.status === 'presente' || registro.presente === true || String(registro.status).toLowerCase() === 'presente') {
                                presencasDoAluno++;
                                totalPresencas++;
                            }
                            totalRegistros++;
                        }
                    }
                });
                if (chamadasDoAluno > 0) {
                    const percentualIndividual = Math.round((presencasDoAluno / chamadasDoAluno) * 100);
                    if (percentualIndividual < 75) {
                        alunosAlerta.push({
                            id: aluno.id,
                            name: aluno.name,
                            matricula: aluno.matricula || String(aluno.id).substring(0, 8).toUpperCase(),
                            classCode: nomeMateriaExibicao || "Disciplina",
                            percentage: percentualIndividual,
                            absences: chamadasDoAluno - presencasDoAluno
                        });
                    }
                }
            });
            const mediaRealCalculada = totalRegistros > 0
                ? Math.round((totalPresencas / totalRegistros) * 100)
                : (todasAsChamadas.length > 0 ? 0 : 100);
            return {
                totalAlunos: totalAlunosContados > 0 ? totalAlunosContados : todosAlunos.length,
                totalTurmas: turmas.length,
                mediaPresenca: mediaRealCalculada,
                baixaFrequencia: alunosAlerta.sort((a, b) => a.percentage - b.percentage),
            };
        }
        catch (error) {
            console.error("[Dashboard Error] Erro ao processar sumário da dashboard:", error);
            return { totalAlunos: 0, totalTurmas: 0, mediaPresenca: 0, baixaFrequencia: [] };
        }
    }
    async findAll() {
        return await this.attendanceRepo.find();
    }
    async findByClass(classId, startDate, endDate) {
        return await this.attendanceRepo.find({ where: { classId } });
    }
    async getClasseReport(classId) {
        try {
            const turma = await this.classRepo.findOne({ where: { id: classId } });
            if (!turma) {
                throw new common_1.NotFoundException('Turma não localizada no sistema.');
            }
            const todasAsChamadas = await this.attendanceRepo.find();
            const chamadas = todasAsChamadas.filter(c => String(c.classId).trim() === String(classId).trim());
            console.log(`[Relatório] Processando ${turma.name} | Chamadas encontradas: ${chamadas.length}`);
            let matriculadosIds = [];
            if (turma.studentIds) {
                if (typeof turma.studentIds === 'string') {
                    try {
                        matriculadosIds = JSON.parse(turma.studentIds);
                    }
                    catch {
                        matriculadosIds = [];
                    }
                }
                else if (Array.isArray(turma.studentIds)) {
                    matriculadosIds = turma.studentIds;
                }
            }
            let alunosFisicos = [];
            const todosUsuarios = await this.userRepo.find();
            alunosFisicos = todosUsuarios.filter(u => u.role === 'aluno' &&
                matriculadosIds.map(String).includes(String(u.id)));
            if (alunosFisicos.length === 0) {
                alunosFisicos = todosUsuarios.filter(u => u.role === 'aluno');
            }
            if (!chamadas || chamadas.length === 0) {
                const studentAttendanceVazio = alunosFisicos.map(aluno => ({
                    id: aluno.id,
                    name: aluno.name,
                    matricula: aluno.matricula || String(aluno.id).substring(0, 8).toUpperCase(),
                    percentage: 0,
                    presences: 0,
                    absences: 0,
                }));
                return {
                    mediaPresenca: 0,
                    totalAlunos: alunosFisicos.length,
                    chamadasRealizadas: 0,
                    attendanceByDate: [],
                    studentAttendance: studentAttendanceVazio
                };
            }
            let totalPresencasGerais = 0;
            let totalRegistrosGerais = 0;
            const attendanceByDate = chamadas.map(chamada => {
                let listaAlunos = [];
                if (typeof chamada.studentsResult === 'string') {
                    try {
                        listaAlunos = JSON.parse(chamada.studentsResult);
                    }
                    catch {
                        listaAlunos = [];
                    }
                }
                else if (Array.isArray(chamada.studentsResult)) {
                    listaAlunos = chamada.studentsResult;
                }
                else if (chamada.studentsResult && typeof chamada.studentsResult === 'object') {
                    listaAlunos = Object.values(chamada.studentsResult);
                }
                const presentes = listaAlunos.filter((a) => a.status === 'presente' || a.presente === true || String(a.status).toLowerCase() === 'presente').length;
                const total = listaAlunos.length || alunosFisicos.length || 1;
                totalPresencasGerais += presentes;
                totalRegistrosGerais += total;
                let dataExibicao = chamada.date;
                if (!dataExibicao && chamada.createdAt) {
                    dataExibicao = new Date(chamada.createdAt).toISOString().split('T')[0];
                }
                if (dataExibicao && dataExibicao.includes('-')) {
                    dataExibicao = dataExibicao.split('-').reverse().join('/');
                }
                return {
                    date: dataExibicao || 'Data Indefinida',
                    percentage: total > 0 ? Math.round((presentes / total) * 100) : 0
                };
            });
            const studentAttendance = alunosFisicos.map(aluno => {
                let presencasDoAluno = 0;
                chamadas.forEach(chamada => {
                    let listaAlunos = [];
                    if (typeof chamada.studentsResult === 'string') {
                        try {
                            listaAlunos = JSON.parse(chamada.studentsResult);
                        }
                        catch {
                            listaAlunos = [];
                        }
                    }
                    else if (Array.isArray(chamada.studentsResult)) {
                        listaAlunos = chamada.studentsResult;
                    }
                    else if (chamada.studentsResult && typeof chamada.studentsResult === 'object') {
                        listaAlunos = Object.values(chamada.studentsResult);
                    }
                    const registro = listaAlunos.find((a) => String(a.id).trim() === String(aluno.id).trim() ||
                        String(a.studentId).trim() === String(aluno.id).trim() ||
                        String(a.name).toLowerCase().trim() === String(aluno.name).toLowerCase().trim());
                    if (registro && (registro.status === 'presente' || registro.presente === true || String(registro.status).toLowerCase() === 'presente')) {
                        presencasDoAluno++;
                    }
                });
                const totalDeChamadas = chamadas.length;
                const absences = totalDeChamadas - presencasDoAluno;
                const percentage = totalDeChamadas > 0 ? Math.round((presencasDoAluno / totalDeChamadas) * 100) : 0;
                return {
                    id: aluno.id,
                    name: aluno.name,
                    matricula: aluno.matricula || String(aluno.id).substring(0, 8).toUpperCase(),
                    percentage: percentage,
                    presences: presencasDoAluno,
                    absences: absences >= 0 ? absences : 0
                };
            });
            const mediaGeralCalculada = totalRegistrosGerais > 0
                ? Math.round((totalPresencasGerais / totalRegistrosGerais) * 100)
                : 0;
            return {
                mediaPresenca: mediaGeralCalculada || 0,
                totalAlunos: alunosFisicos.length,
                chamadasRealizadas: chamadas.length,
                attendanceByDate: attendanceByDate,
                studentAttendance: studentAttendance
            };
        }
        catch (error) {
            console.error("[Relatório Error] Falha crítica na consolidação de diários reais:", error);
            return { mediaPresenca: 0, totalAlunos: 0, chamadasRealizadas: 0, attendanceByDate: [], studentAttendance: [] };
        }
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