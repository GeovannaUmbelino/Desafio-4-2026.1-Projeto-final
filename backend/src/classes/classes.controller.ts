import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Roles, CurrentUser } from '../common/decorators';
import { User, UserRole } from '../users/entities/user.entity';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Get()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  findAll(@CurrentUser() user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.classesService.findAll();
    }
    return this.classesService.findByTeacher(user.id);
  }

  // GET /classes/all — todas as turmas (aluno usa para filtrar as suas)
  @Get('all')
  findAllPublic() {
    return this.classesService.findAll();
  }

  // GET /classes/teacher/:teacherId — turmas de um professor específico
  @Get('teacher/:teacherId')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  // GET /classes/:id/dashboard — dados da turma para relatórios
  @Get(':id/dashboard')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  getDashboard(@Param('id') id: string) {
    return this.classesService.getClassDashboardData(id);
  }

  @Get(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
    return this.classesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}
