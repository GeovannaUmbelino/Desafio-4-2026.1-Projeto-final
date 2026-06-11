import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // 1. Rota para o professor enviar a chamada
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  // 2. Rota para listar TODAS as chamadas do sistema
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  // 3. Rota para buscar o histórico de chamadas de uma turma específica
  @Get('turma/:classId')
  findByClass(@Param('classId') classId: string) {
    return this.attendanceService.findByClass(classId);
  }
}
