import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AttendanceRecordDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsOptional()
  isPresent?: boolean;

  @IsOptional()
  present?: boolean;
}

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  classId!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsArray()
  @IsOptional()
  records!: AttendanceRecordDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  presentStudents!: string[];
}