export declare enum UserRole {
    ADMIN = "admin",
    PROFESSOR = "professor",
    ALUNO = "aluno"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    matricula?: string;
    fotoUrl: string | null;
    isActive: boolean;
    createdAt: Date;
}
