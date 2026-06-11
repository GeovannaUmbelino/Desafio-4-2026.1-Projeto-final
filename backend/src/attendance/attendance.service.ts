import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Class } from '../classes/entities/class.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const { classId, date, presentStudents } = createAttendanceDto;

    const classExists = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classExists) {
      throw new NotFoundException(
        `Turma com o ID "${classId}" não foi encontrada.`,
      );
    }

    const newAttendance = this.attendanceRepository.create({
      classId,
      date,
      presentStudents: JSON.stringify(presentStudents),
    });

    return await this.attendanceRepository.save(newAttendance);
  }

  async findAll(): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      relations: { class: true },
    });
  }

  async findByClass(classId: string): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      where: { classId },
      order: { createdAt: 'DESC' },
    });
  }
}
