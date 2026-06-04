import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importação necessária
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // A configuração do banco de dados entra aqui dentro!
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH || './data/presenca.db',
      autoLoadEntities: true,
      synchronize: true, // em dev tá ótimo, cria as tabelas automaticamente
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}