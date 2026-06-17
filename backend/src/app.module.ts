import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { AttendanceModule } from './attendance/attendance.module';
import { User } from './users/entities/user.entity';
import { Class } from './classes/entities/class.entity';
import { Attendance } from './attendance/entities/attendance.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_URL ?? 'data/presenca.db',
      entities: [User, Class, Attendance],

      synchronize: true,
    }),

    // Registro dos Módulos Core da Aplicação
    AuthModule,
    UsersModule,
    ClassesModule,
    AttendanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
