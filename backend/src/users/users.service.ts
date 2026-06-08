import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. Função para Visualizar o Perfil
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userResponse = user as Omit<User, 'password'>;

    return userResponse as User;
  }

  // 2. Função para Editar os Dados do Perfil
  async update(id: string, updateUserData: Partial<User>): Promise<User> {
    const user = await this.findOne(id); // Garante que o usuário existe
    // Mescla os dados novos com os dados antigos
    const updatedUser = this.userRepository.merge(user, updateUserData);
    // Salva as alterações no banco de dados
    return await this.userRepository.save(updatedUser);
  }

  // 3. Função para Deletar a Conta
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id); // Garante que o usuário existe
    await this.userRepository.remove(user);
    return { message: 'Conta deletada com sucesso' };
  }
}
