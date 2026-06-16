import { ClassesService } from './classes.service';
import { User } from '../users/entities/user.entity';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(dto: any, user: User): Promise<import("./entities/class.entity").Class>;
    addStudent(classId: string, dto: any): Promise<import("./entities/class.entity").Class>;
    findAll(user: User): Promise<import("./entities/class.entity").Class[]>;
    findByTeacher(teacherId: string): Promise<import("./entities/class.entity").Class[]>;
    findOne(id: string): Promise<import("./entities/class.entity").Class>;
    remove(id: string): Promise<import("./entities/class.entity").Class>;
}
