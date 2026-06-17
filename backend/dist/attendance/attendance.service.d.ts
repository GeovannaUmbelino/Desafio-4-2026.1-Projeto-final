import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
export declare class AttendanceService {
    private readonly attendanceRepo;
    private readonly classRepo;
    private readonly userRepo;
    constructor(attendanceRepo: Repository<Attendance>, classRepo: Repository<Class>, userRepo: Repository<User>);
    create(dto: any, user: any): Promise<Attendance>;
    getDashboardStats(user: any): Promise<{
        totalAlunos: number;
        totalTurmas: number;
        mediaPresenca: number;
        baixaFrequencia: any[];
    }>;
    findAll(): Promise<Attendance[]>;
    findByClass(classId: string, startDate?: string, endDate?: string): Promise<Attendance[]>;
    getClasseReport(classId: string): Promise<{
        mediaPresenca: number;
        totalAlunos: number;
        chamadasRealizadas: number;
        attendanceByDate: {
            date: string;
            percentage: number;
        }[];
        studentAttendance: {
            id: string;
            name: string;
            matricula: string;
            percentage: number;
            presences: number;
            absences: number;
        }[];
    }>;
}
