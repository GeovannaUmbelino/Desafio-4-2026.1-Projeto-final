import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles, CurrentUser } from '../common/decorators';
import { User, UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return user;
  }

  // 💡 CORREÇÃO CRÍTICA: Adicionado UserRole.PROFESSOR para evitar o Erro 403 (Forbidden)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('by-ids')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR, UserRole.ALUNO)
  async findByIds(@Query('ids') ids: string) {
    if (!ids) return [];
    const idArray = ids.split(',');
    return this.usersService.findByIds(idArray);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: User, @Body() updateDto: any) {
    return this.usersService.update(user.id, updateDto);
  }

  @Delete('me')
  async deleteMe(@CurrentUser() user: User) {
    return this.usersService.remove(user.id);
  }
}