import { IsNotEmpty, IsString, IsEmail, IsEnum } from 'class-validator';

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
  @IsEnum(['professor', 'aluno'], {
    message: 'O papel deve ser professor ou aluno.',
  })
  role!: string;
}
