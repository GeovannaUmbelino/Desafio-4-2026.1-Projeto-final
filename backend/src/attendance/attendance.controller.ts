import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'; // Adicionado o Query aqui!
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Rota criar chamada
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  // Rota listar todas as chamadas
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  // Rota buscar chamadas por turma (Aceita query params opcionais: ?startDate=...&endDate=...)
  @Get('turma/:classId')
  findByClass(
    @Param('classId') classId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findByClass(classId, startDate, endDate);
  }

  // Rota gerar relatório da turma
  @Get('turma/:classId/report')
  getReport(@Param('classId') classId: string) {
    return this.attendanceService.getAttendanceReport(classId);
  }
}
