import { UsersService } from './users.service';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: User): Promise<User>;
    findAll(): Promise<Omit<User, "password">[]>;
    findByIds(ids: string): Promise<Omit<User, "password">[]>;
    findOne(id: string): Promise<Omit<User, "password">>;
    updateMe(user: User, updateDto: any): Promise<Omit<User, "password">>;
    deleteMe(user: User): Promise<{
        message: string;
    }>;
}
