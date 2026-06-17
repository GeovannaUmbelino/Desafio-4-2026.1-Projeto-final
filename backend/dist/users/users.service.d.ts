import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("./entities/user.entity").UserRole;
        matricula?: string;
        fotoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    findAll(): Promise<Omit<User, 'password'>[]>;
    findByIds(ids: string[]): Promise<Omit<User, 'password'>[]>;
    findByEmail(email: string): Promise<User | null>;
    findOne(id: string): Promise<Omit<User, 'password'>>;
    update(id: string, updateUserData: Partial<User>): Promise<Omit<User, 'password'>>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
