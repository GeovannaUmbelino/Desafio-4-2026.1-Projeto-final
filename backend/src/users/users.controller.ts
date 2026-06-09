import { Controller, Get, Body, Patch, Delete, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

interface RequestWithUser extends Request {
  user?: {
    id: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. Rota para Visualizar o Perfil: GET /users/me
  @Get('me')
  async getProfile(@Req() req: RequestWithUser): Promise<User> {
    const userId = req.user?.id || '';
    return this.usersService.findOne(userId);
  }

  // 2. Rota para Editar Dados: PATCH /users/me
  @Patch('me')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateUserData: Partial<User>,
  ): Promise<User> {
    const userId = req.user?.id || '';
    return this.usersService.update(userId, updateUserData);
  }

  // 3. Rota para Deletar Conta: DELETE /users/me
  @Delete('me')
  async deleteAccount(
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    const userId = req.user?.id || '';
    return this.usersService.remove(userId);
  }
}
