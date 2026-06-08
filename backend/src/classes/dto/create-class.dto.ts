import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty({ message: 'O nome da turma é obrigatório.' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'O código da turma é obrigatório.' })
  @IsString()
  code!: string;

  @IsNotEmpty({ message: 'O ID do professor responsável é obrigatório.' })
  @IsUUID('4', { message: 'O ID do professor deve ser um UUID válido.' })
  teacherId!: string;
}
