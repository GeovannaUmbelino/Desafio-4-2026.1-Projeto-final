import { AttendanceService } from './attendance.service';
import { User } from '../users/entities/user.entity';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(dto: any, user: User): Promise<import("./entities/attendance.entity").Attendance>;
    submit(dto: any, user: User): Promise<import("./entities/attendance.entity").Attendance>;
    getDashboardStats(user: User): Promise<{
        totalAlunos: number;
        totalTurmas: number;
        mediaPresenca: number;
        baixaFrequencia: any[];
    }>;
    findAll(): Promise<import("./entities/attendance.entity").Attendance[]>;
    findByClass(classId: string, startDate?: string, endDate?: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    getAttendanceReport(classId: string): Promise<{
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
