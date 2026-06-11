import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  classId!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsArray()
  @IsString({ each: true })
  presentStudents!: string[];
}
