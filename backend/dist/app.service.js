"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AppService = class AppService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
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
        }
        catch (error) {
            console.log('Aguardando criação das tabelas...');
        }
    }
    getHello() {
        return 'EngNet API Online';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AppService);
//# sourceMappingURL=app.service.js.map