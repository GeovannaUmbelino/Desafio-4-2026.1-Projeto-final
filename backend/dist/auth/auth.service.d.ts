import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AuthResponse, LoginDto } from './dto/auth.dto';
export declare class AuthService implements OnModuleInit {
    private readonly userRepo;
    private readonly jwtService;
    private readonly SALT_ROUNDS;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    onModuleInit(): Promise<void>;
    register(dto: any): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    private buildAuthResponse;
    getProfile(userId: string): Promise<Omit<User, 'password'>>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
