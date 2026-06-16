import { Class } from '../../classes/entities/class.entity';
export declare class Attendance {
    id: string;
    class: Class;
    classId: string;
    date: string;
    presentStudents: string;
    createdAt: Date;
}
