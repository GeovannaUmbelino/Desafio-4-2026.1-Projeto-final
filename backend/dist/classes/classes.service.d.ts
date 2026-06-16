import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
export declare class ClassesService {
    private readonly classRepo;
    constructor(classRepo: Repository<Class>);
    create(dto: any): Promise<Class>;
    addStudent(classId: string, studentId: string): Promise<Class>;
    findAll(user: any): Promise<Class[]>;
    findOne(id: string): Promise<Class>;
    remove(id: string): Promise<Class>;
}
