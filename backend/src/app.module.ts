import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH || './data/presenca.db',
      autoLoadEntities: true,
      synchronize: true, // Em produção, usar migrations
    }),
    AuthModule,   // ← Auth registrado ANTES dos demais (os guards são globais)
    UsersModule,
    AttendanceModule,
    ClassesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}