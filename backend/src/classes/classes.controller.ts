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

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.createClass(
      createClassDto.name,
      createClassDto.code,
      createClassDto.teacherId,
    );
  }

  @Patch(':id/enroll')
  enrollStudent(
    @Param('id') classId: string,
    @Body('studentId') studentId: string,
  ) {
    return this.classesService.enrollStudent(classId, studentId);
  }

  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.classesService.findByStudent(studentId);
  }

  // NOVA ROTA: Obter dados gerais e quantidade de alunos da turma
  @Get(':id/dashboard')
  getClassDashboard(@Param('id') id: string) {
    return this.classesService.getClassDashboardData(id);
  }

  // NOVA ROTA: Editar dados da turma (nome/codigo)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.updateClass(id, updateClassDto);
  }

  // NOVA ROTA: Deletar uma turma
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.removeClass(id);
  }
}
