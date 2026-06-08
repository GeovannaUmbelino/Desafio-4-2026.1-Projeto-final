import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClassesModule } from './classes/classes.module';
import { User } from './users/entities/user.entity'; // Importa a entidade de usuários
import { Class } from './classes/entities/class.entity'; // Importa a entidade de turmas

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH || './data/presenca.db',
      entities: [User, Class], // Garantimos que o SQLite crie ambas as tabelas sem falhas
      synchronize: true, // Sincroniza e cria as tabelas automaticamente
    }),
    UsersModule,
    AuthModule,
    ClassesModule, // O seu módulo principal da Sprint 2
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
