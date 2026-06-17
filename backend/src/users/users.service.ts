import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Função para criar usuário
  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const saved = await this.userRepository.save(newUser);

    
    const { password: _password, ...userWithoutPassword } = saved;
    return userWithoutPassword;
  }

  // Listar todos os usuários (admin)
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({ order: { name: 'ASC' } });
    return users.map(({ password: _p, ...u }) => u);
  }

  // Função para encontrar múltiplos usuários por IDs
  async findByIds(ids: string[]): Promise<Omit<User, 'password'>[]> {
    if (!ids.length) return [];
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids })
      .getMany();
    return users.map(({ password: _p, ...u }) => u);
  }

  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Função para Visualizar o Perfil
  async findOne(id: string): Promise<Omit<User, 'password'>> {
    if (!id) {
      throw new NotFoundException('ID do usuário não fornecido');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Função para Editar os Dados do Perfil
  async update(id: string, updateUserData: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    
    if (updateUserData.password) {
      updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
    }

    const updatedUser = this.userRepository.merge(user, updateUserData);
    const saved = await this.userRepository.save(updatedUser);
    const { password: _password, ...userWithoutPassword } = saved;
    return userWithoutPassword;
  }

  // Função para Deletar a Conta
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.userRepository.remove(user);
    return { message: 'Conta deletada com sucesso' };
  }
}