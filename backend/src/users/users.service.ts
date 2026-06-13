import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //Função para criar usuário
  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  //Função para Visualizar o Perfil
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userResponse = user as Omit<User, 'password'>;

    return userResponse as User;
  }

  //Função para Editar os Dados do Perfil
  async update(id: string, updateUserData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    // Mescla os dados novos com os dados antigos
    const updatedUser = this.userRepository.merge(user, updateUserData);
    // Salva as alterações no banco de dados
    return await this.userRepository.save(updatedUser);
  }

  //Função para Deletar a Conta
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'Conta deletada com sucesso' };
  }
}
