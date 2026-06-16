import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { User } from '../users/entities/user.entity';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(dto: CreateClassDto): Promise<import("./entities/class.entity").Class>;
    findAll(user: User): Promise<import("./entities/class.entity").Class[]>;
    findAllPublic(): Promise<import("./entities/class.entity").Class[]>;
    findByTeacher(teacherId: string): Promise<import("./entities/class.entity").Class[]>;
    getDashboard(id: string): Promise<{
        id: string;
        name: string;
        code: string;
        schedule: string;
        totalStudents: number;
        studentIds: string[];
    }>;
    findOne(id: string): Promise<import("./entities/class.entity").Class>;
    update(id: string, dto: UpdateClassDto): Promise<import("./entities/class.entity").Class>;
    remove(id: string): Promise<void>;
}
