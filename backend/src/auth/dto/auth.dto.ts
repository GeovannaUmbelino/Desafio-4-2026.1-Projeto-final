import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

// Login 
export class LoginDto {
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  password!: string;
}

// Cadastro 
export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(120)
  name!: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string;

 
  @IsString()
  @MinLength(6, { message: 'A senha deve ter ao menos 6 caracteres.' })
  @Matches(/(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'A senha deve conter ao menos uma letra e um número.',
  })
  password!: string;

  @IsEnum(UserRole, {
    message: 'Role inválida. Use: admin, professor ou aluno.',
  })
  role!: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(30)
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
  };
}
