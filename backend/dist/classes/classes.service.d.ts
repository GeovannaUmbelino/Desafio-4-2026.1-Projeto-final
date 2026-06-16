import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
export declare class ClassesService {
    private readonly classRepository;
    constructor(classRepository: Repository<Class>);
    create(dto: CreateClassDto): Promise<Class>;
    findAll(): Promise<Class[]>;
    findOne(id: string): Promise<Class>;
    findByTeacher(teacherId: string): Promise<Class[]>;
    update(id: string, dto: UpdateClassDto): Promise<Class>;
    remove(id: string): Promise<void>;
    enrollStudent(classId: string, studentId: string): Promise<Class>;
    findByStudent(studentId: string): Promise<Class[]>;
    getClassDashboardData(id: string): Promise<{
        id: string;
        name: string;
        code: string;
        schedule: string;
        totalStudents: number;
        studentIds: string[];
    }>;
}
