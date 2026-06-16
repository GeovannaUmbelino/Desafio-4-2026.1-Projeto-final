import { UsersService } from './users.service';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): Promise<Omit<User, "password">>;
    findAll(): Promise<Omit<User, "password">[]>;
    updateProfile(user: User, updateData: Partial<{
        name: string;
        matricula: string;
    }>): Promise<Omit<User, "password">>;
    deleteAccount(user: User): Promise<{
        message: string;
    }>;
    findByIds(ids: string): Promise<Omit<User, "password">[]>;
    findOne(id: string): Promise<Omit<User, "password">>;
}
