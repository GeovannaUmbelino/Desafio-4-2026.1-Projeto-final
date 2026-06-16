import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Roles, CurrentUser } from '../common/decorators';
import { UserRole, User } from '../users/entities/user.entity';
import { AttendanceService } from './attendance.service';
import type { SubmitAttendancePayload } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Apenas professores registram chamada
  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  // Endpoint chamado pelo frontend para salvar chamada com records[]
  @Post('submit')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  submit(@Body() payload: SubmitAttendancePayload, @CurrentUser() user: User) {
    return this.attendanceService.submitAttendance(payload, user);
  }

  // Dashboard de presença (admin/professor)
  @Get('dashboard')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  dashboard(@CurrentUser() user: User) {
    return this.attendanceService.getDashboardStats(user);
  }

  // Listar todas as chamadas (professor/admin)
  @Get()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  findAll() {
    return this.attendanceService.findAll();
  }

  // Buscar chamadas por turma — professores e alunos podem ver
  @Get('turma/:classId')
  findByClass(
    @Param('classId') classId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findByClass(classId, startDate, endDate);
  }

  // Relatório da turma — professores e alunos podem ver
  @Get('turma/:classId/report')
  getReport(@Param('classId') classId: string) {
    return this.attendanceService.getAttendanceReport(classId);
  }
}