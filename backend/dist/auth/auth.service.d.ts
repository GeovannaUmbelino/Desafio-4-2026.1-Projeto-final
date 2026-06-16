import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AuthResponse, LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly SALT_ROUNDS;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    private buildAuthResponse;
    getProfile(userId: string): Promise<Omit<User, 'password'>>;
}
