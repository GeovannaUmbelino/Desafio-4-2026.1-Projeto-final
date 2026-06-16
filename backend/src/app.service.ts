import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      const tableExists = await queryRunner.query(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='user';
      `);

      if (tableExists.length > 0) {
        const adminExists = await queryRunner.query(`SELECT * FROM "user" WHERE email = 'admin@engnet.com'`);
        if (adminExists.length === 0) {
          console.log('--- Criando administrador inicial ---');
          await queryRunner.query(`
            INSERT INTO "user" (id, name, email, password, role, "isActive") 
            VALUES ('a1111111-b222-c333-d444-e55555555555', 'Administrador Geral', 'admin@engnet.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1)
          `);
        }
      }
      await queryRunner.release();
    } catch (error) {
      console.log('Aguardando criação das tabelas...');
    }
  }

  getHello(): string {
    return 'EngNet API Online';
  }
}