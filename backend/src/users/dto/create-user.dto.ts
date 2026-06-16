import { IsNotEmpty, IsString, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome do usuário é obrigatório.' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Insira um e-mail válido.' })
  email!: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @IsString()
  password!: string;

  @IsNotEmpty({ message: 'O cargo/função é obrigatório.' })

 @IsEnum(UserRole, { 
    message: 'O papel deve ser admin, professor ou aluno.',
  })
  
  role!: UserRole; 
}
