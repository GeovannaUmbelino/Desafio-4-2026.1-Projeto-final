import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AuthResponse, JwtPayload, LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Cadastro 

  async register(dto: RegisterDto): Promise<AuthResponse> {
    
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
    });
    const saved = await this.userRepo.save(user);

   
    return this.buildAuthResponse(saved);
  }

  // Login 

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
      },
    };
  }

 
  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
   
    const { password: _pw, ...safe } = user;
    return safe as Omit<User, 'password'>;
  }
}
