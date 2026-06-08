import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  // 1. Rota para Criar Turma: POST /classes
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.createClass(
      createClassDto.name,
      createClassDto.code,
      createClassDto.teacherId,
    );
  }

  // 2. Rota para Matricular Aluno: PATCH /classes/:id/enroll
  @Patch(':id/enroll')
  enrollStudent(
    @Param('id') classId: string,
    @Body('studentId') studentId: string,
  ) {
    return this.classesService.enrollStudent(classId, studentId);
  }

  // 3. Rota para listar turmas de um Professor: GET /classes/teacher/:teacherId
  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  // 4. Rota para listar turmas de um Aluno: GET /classes/student/:studentId
  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.classesService.findByStudent(studentId);
  }
}
