import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { AuthResponse, JwtPayload, LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const senhaPadraoHash = await bcrypt.hash('sistema123', this.SALT_ROUNDS);

    // ADMIN GLOBAL
    const adminEmail = 'admin@sistema.com';
    const adminExists = await this.userRepo.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
      const admin = this.userRepo.create({
        name: 'Administrador Global',
        email: adminEmail,
        password: await bcrypt.hash('admin123', this.SALT_ROUNDS),
        role: UserRole.ADMIN,
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
          password: senhaPadraoHash, // senha: sistema123
          role: UserRole.PROFESSOR,
          matricula: prof.matricula,
          fotoUrl: null,
        });
        await this.userRepo.save(novoProf);
        console.log(`   └─ Criado: ${prof.name}`);
      }
    }

    // ALUNOS FICTÍCIOS 
    const listaAlunos = [
      // Grupo 1
      { name: 'Ana Beatriz Souza', email: 'ana.beatriz@aluno.com', matricula: '221003456' },
      { name: 'Gabriel Mendes Rocha', email: 'gabriel.mendes@aluno.com', matricula: '231012987' },
      { name: 'Lucas Oliveira Lima', email: 'lucas.oliveira@aluno.com', matricula: '211008765' },
      { name: 'Mariana Costa Ribeiro', email: 'mariana.costa@aluno.com', matricula: '241009123' },
      { name: 'Rodrigo Alves Almeida', email: 'rodrigo.alves@aluno.com', matricula: '221011564' },
      { name: 'Beatriz Martins Fonseca', email: 'beatriz.martins@aluno.com', matricula: '231005432' },
      // Grupo 2
      { name: 'Camila Cavalcante', email: 'camila.cavalcante@aluno.com', matricula: '221007891' },
      { name: 'Gabriel Maciel', email: 'gabriel.maciel@aluno.com', matricula: '221004562' },
      { name: 'Brenda Maciel', email: 'brenda.maciel@aluno.com', matricula: '231001234' },
      { name: 'Mateus Cardoso Melo', email: 'mateus.cardoso@aluno.com', matricula: '241008877' },
      { name: 'Larissa Teixeira Nunes', email: 'larissa.teixeira@aluno.com', matricula: '211009988' },
      { name: 'Felipe Barbosa Vieira', email: 'felipe.barbosa@aluno.com', matricula: '221002211' },
      // Grupo 3
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
          password: senhaPadraoHash, // senha: sistema123
          role: UserRole.ALUNO,
          matricula: alunoData.matricula,
          fotoUrl: null,
        });
        await this.userRepo.save(aluno);
        console.log(`   └─ Criado: ${alunoData.name} (${alunoData.matricula})`);
      }
    }
    console.log('-----------------------------------------\n');
  }

  async register(dto: any): Promise<AuthResponse> {
    const emailExists = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });
    
    if (emailExists) {
      throw new ConflictException(
        'E-mail já cadastrado. Use outro e-mail ou faça login.',
      );
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

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Conta desativada. Entre em contato com o administrador.',
      );
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User): AuthResponse {
    const payload: JwtPayload = {
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

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    const { password: _pw, ...safe } = user;
    return safe as Omit<User, 'password'>;
  }

  async deleteAccount(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado no sistema.');
    }
    await this.userRepo.remove(user);
    return { message: 'Conta excluída com sucesso!' };
  }
}