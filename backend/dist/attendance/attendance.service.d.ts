import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
export interface AttendanceRecord {
    studentId: string;
    present: boolean;
}
export interface SubmitAttendancePayload {
    classId: string;
    date: string;
    records: AttendanceRecord[];
}
export interface DashboardStats {
    totalAlunos: number;
    totalTurmas: number;
    mediaPresenca: number;
    baixaFrequencia: {
        alunoId: string;
        presencas: number;
        totalAulas: number;
        porcentagem: number;
    }[];
}
export declare class AttendanceService {
    private readonly attendanceRepo;
    private readonly classRepo;
    private readonly userRepo;
    constructor(attendanceRepo: Repository<Attendance>, classRepo: Repository<Class>, userRepo: Repository<User>);
    create(dto: CreateAttendanceDto): Promise<Attendance>;
    submitAttendance(payload: SubmitAttendancePayload, professor: User): Promise<Attendance>;
    getDashboardStats(requester: User): Promise<DashboardStats>;
    findAll(): Promise<Attendance[]>;
    findByClass(classId: string, startDate?: string, endDate?: string): Promise<Attendance[]>;
    getAttendanceReport(classId: string): Promise<{
        classId: string;
        totalAulas: number;
        mediaFrequenciaTurma: string;
        relatorioAlunos: {
            alunoId: string;
            presencas: number;
            faltas: number;
            porcentagemFrequencia: number;
            status: string;
        }[];
    }>;
}
