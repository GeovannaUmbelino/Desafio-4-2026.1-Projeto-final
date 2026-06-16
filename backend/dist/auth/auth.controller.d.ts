import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, file: Express.Multer.File): Promise<import("./dto/auth.dto").AuthResponse>;
    login(dto: LoginDto): Promise<import("./dto/auth.dto").AuthResponse>;
    getProfile(user: User): Promise<Omit<User, "password">>;
    deleteAccount(user: User): Promise<{
        message: string;
    }>;
}
