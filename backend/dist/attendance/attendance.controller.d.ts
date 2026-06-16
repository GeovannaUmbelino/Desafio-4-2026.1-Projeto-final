import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { User } from '../users/entities/user.entity';
import { AttendanceService } from './attendance.service';
import type { SubmitAttendancePayload } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(createAttendanceDto: CreateAttendanceDto): Promise<import("./entities/attendance.entity").Attendance>;
    submit(payload: SubmitAttendancePayload, user: User): Promise<import("./entities/attendance.entity").Attendance>;
    dashboard(user: User): Promise<import("./attendance.service").DashboardStats>;
    findAll(): Promise<import("./entities/attendance.entity").Attendance[]>;
    findByClass(classId: string, startDate?: string, endDate?: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    getReport(classId: string): Promise<{
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
