"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = class AuthService {
    userRepo;
    jwtService;
    SALT_ROUNDS = 12;
    constructor(userRepo, jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    async onModuleInit() {
        const senhaPadraoHash = await bcrypt.hash('sistema123', this.SALT_ROUNDS);
        const adminEmail = 'admin@sistema.com';
        const adminExists = await this.userRepo.findOne({ where: { email: adminEmail } });
        if (!adminExists) {
            const admin = this.userRepo.create({
                name: 'Administrador Global',
                email: adminEmail,
                password: await bcrypt.hash('admin123', this.SALT_ROUNDS),
                role: user_entity_1.UserRole.ADMIN,
                matricula: '000000',
                fotoUrl: null,
            });
            await this.userRepo.save(admin);
            console.log('[SEED] Usuário Admin pronto: admin@sistema.com / admin123');
        }
        const listaProfessores = [
            { name: 'Dr. Arlindo Galvão', email: 'arlindo.galvao@professor.com', matricula: '111222' },
            { name: 'Dra. Gi Bordignon', email: 'gi.bordignon@professor.com', matricula: '333444' },
            { name: 'Prof. Carlos Santos', email: 'carlos.santos@professor.com', matricula: '555666' }
        ];
        console.log('POPULANDO BANCO DE DADOS (PROFESSORES)...');
        for (const prof of listaProfessores) {
            const exists = await this.userRepo.findOne({ where: { email: prof.email } });
            if (!exists) {
                const novoProf = this.userRepo.create({
                    name: prof.name,
                    email: prof.email,
                    password: senhaPadraoHash,
                    role: user_entity_1.UserRole.PROFESSOR,
                    matricula: prof.matricula,
                    fotoUrl: null,
                });
                await this.userRepo.save(novoProf);
                console.log(`   └─ Criado: ${prof.name}`);
            }
        }
        const listaAlunos = [
            { name: 'Ana Beatriz Souza', email: 'ana.beatriz@aluno.com', matricula: '221003456' },
            { name: 'Gabriel Mendes Rocha', email: 'gabriel.mendes@aluno.com', matricula: '231012987' },
            { name: 'Lucas Oliveira Lima', email: 'lucas.oliveira@aluno.com', matricula: '211008765' },
            { name: 'Mariana Costa Ribeiro', email: 'mariana.costa@aluno.com', matricula: '241009123' },
            { name: 'Rodrigo Alves Almeida', email: 'rodrigo.alves@aluno.com', matricula: '221011564' },
            { name: 'Beatriz Martins Fonseca', email: 'beatriz.martins@aluno.com', matricula: '231005432' },
            { name: 'Camila Cavalcante', email: 'camila.cavalcante@aluno.com', matricula: '221007891' },
            { name: 'Gabriel Maciel', email: 'gabriel.maciel@aluno.com', matricula: '221004562' },
            { name: 'Brenda Maciel', email: 'brenda.maciel@aluno.com', matricula: '231001234' },
            { name: 'Mateus Cardoso Melo', email: 'mateus.cardoso@aluno.com', matricula: '241008877' },
            { name: 'Larissa Teixeira Nunes', email: 'larissa.teixeira@aluno.com', matricula: '211009988' },
            { name: 'Felipe Barbosa Vieira', email: 'felipe.barbosa@aluno.com', matricula: '221002211' },
            { name: 'Geovanna Alves Umbelino', email: 'geovanna.alves@aluno.com', matricula: '241001122' },
            { name: 'Luisa Meireles Prado', email: 'luisa.meireles@aluno.com', matricula: '231006655' },
            { name: 'Gustavo Henrique Silva', email: 'gustavo.henrique@aluno.com', matricula: '221004433' },
            { name: 'Laura Antunes Ramos', email: 'laura.antunes@aluno.com', matricula: '241003322' },
            { name: 'Thiago Neves Ferreira', email: 'thiago.neves@aluno.com', matricula: '211007766' },
            { name: 'Sofia Castro Rezende', email: 'sofia.castro@aluno.com', matricula: '231009900' }
        ];
        console.log('POPULANDO BANCO DE DADOS (ALUNOS)...');
        for (const alunoData of listaAlunos) {
            const exists = await this.userRepo.findOne({ where: { email: alunoData.email } });
            if (!exists) {
                const aluno = this.userRepo.create({
                    name: alunoData.name,
                    email: alunoData.email,
                    password: senhaPadraoHash,
                    role: user_entity_1.UserRole.ALUNO,
                    matricula: alunoData.matricula,
                    fotoUrl: null,
                });
                await this.userRepo.save(aluno);
                console.log(`   └─ Criado: ${alunoData.name} (${alunoData.matricula})`);
            }
        }
        console.log('-----------------------------------------\n');
    }
    async register(dto) {
        const emailExists = await this.userRepo.findOne({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (emailExists) {
            throw new common_1.ConflictException('E-mail já cadastrado. Use outro e-mail ou faça login.');
        }
        const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
        const user = this.userRepo.create({
            name: dto.name.trim(),
            email: dto.email.toLowerCase().trim(),
            password: hashedPassword,
            role: dto.role,
            matricula: dto.matricula?.trim(),
            fotoUrl: dto.fotoUrl,
        });
        const saved = await this.userRepo.save(user);
        return this.buildAuthResponse(saved);
    }
    async login(dto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('E-mail ou senha incorretos.');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Conta desativada. Entre em contato com o administrador.');
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('E-mail ou senha incorretos.');
        }
        return this.buildAuthResponse(user);
    }
    buildAuthResponse(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                matricula: user.matricula,
                fotoUrl: user.fotoUrl,
            },
        };
    }
    async getProfile(userId) {
        const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
        const { password: _pw, ...safe } = user;
        return safe;
    }
    async deleteAccount(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado no sistema.');
        }
        await this.userRepo.remove(user);
        return { message: 'Conta excluída com sucesso!' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map