import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  // 1. CRIAÇÃO DE TURMAS
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.createClass(
      createClassDto.name,
      createClassDto.code,
      createClassDto.teacherId,
      createClassDto.schedule,
    );
  }

  // 2. MATRÍCULA DE ALUNOS
  @Patch(':id/enroll')
  enrollStudent(
    @Param('id') classId: string,
    @Body('studentId') studentId: string,
  ) {
    return this.classesService.enrollStudent(classId, studentId);
  }

  // 3. LISTAGEM POR PROFESSOR
  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  // 4. LISTAGEM POR ALUNO
  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.classesService.findByStudent(studentId);
  }

  // 5. DASHBOARD DA TURMA
  @Get(':id/dashboard')
  getClassDashboard(@Param('id') id: string) {
    return this.classesService.getClassDashboardData(id);
  }

  // 6. EDIÇÃO DE TURMAS
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.updateClass(id, updateClassDto);
  }

  // 7. EXCLUSÃO DE TURMAS
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.removeClass(id);
  }
}
