import { UserRole } from '../../users/entities/user.entity';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    matricula?: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}
export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        matricula?: string;
        fotoUrl?: string | null;
    };
}
