import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Roles, CurrentUser } from '../common/decorators';
import { User, UserRole } from '../users/entities/user.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async create(@Body() dto: any, @CurrentUser() user: User) {
    return this.attendanceService.create(dto, user);
  }

  @Post('submit')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async submit(@Body() dto: any, @CurrentUser() user: User) {
    return this.attendanceService.create(dto, user);
  }

  @Get('dashboard')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.ALUNO)
  async getDashboardStats(@CurrentUser() user: User) {
    return this.attendanceService.getDashboardStats(user);
  }

  @Get()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async findAll() {
    return this.attendanceService.findAll();
  }

  @Get('turma/:classId')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.ALUNO)
  async findByClass(
    @Param('classId') classId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findByClass(classId, startDate, endDate);
  }

  // 💡 CORREÇÃO CONECTADA: Mapeia as duas rotas chamando o método exato do seu serviço estruturado
  @Get(['turma/:classId/report', 'metrics/class/:classId'])
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.ALUNO)
  async getAttendanceReport(@Param('classId') classId: string) {
    return this.attendanceService.getClasseReport(classId); // Mapeia para a função real
  }
}