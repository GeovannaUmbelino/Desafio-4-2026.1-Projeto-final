import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { Roles, CurrentUser } from '../common/decorators';
import { User, UserRole } from '../users/entities/user.entity';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  // POST /classes — Cria uma nova turma (Admin e Professor)
  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async create(@Body() dto: any, @CurrentUser() user: User) {
    const teacherId = user.role === 'admin' ? dto.teacherId : user.id;
    return this.classesService.create({
      name: dto.name,
      code: dto.code,
      schedule: dto.schedule,
      teacherId: teacherId,
    });
  }

  // PATCH /classes/:id/add-student — Vincula aluno ao array studentIds da turma
  @Patch(':id/add-student')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async addStudent(@Param('id') classId: string, @Body() dto: any) {
    return this.classesService.addStudent(classId, dto.studentId);
  }

  // 📝 CORREÇÃO AQUI: Passando um array no @Get, o NestJS passa a aceitar tanto "/classes" quanto "/classes/all"
  @Get(['', 'all'])
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.ALUNO)
  async findAll(@CurrentUser() user: User) {
    return this.classesService.findAll(user);
  }

  // GET /classes/teacher/:id — Busca de turmas por ID de professor
  @Get('teacher/:id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async findByTeacher(@Param('id') teacherId: string) {
    return this.classesService.findAll({ id: teacherId, role: 'professor' });
  }

  // GET /classes/:id — Detalhes de uma turma específica
  @Get(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.ALUNO)
  async findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  // DELETE /classes/:id — Remove uma turma (Apenas Admin)
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}