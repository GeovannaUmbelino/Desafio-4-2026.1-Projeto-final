import { Controller, Get, Body, Patch, Delete, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { User, UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me — perfil do usuário logado (qualquer role)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  // GET /users — listar todos os usuários (somente admin)
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // PATCH /users/me — editar próprio perfil
  @Patch('me')
  updateProfile(
    @CurrentUser() user: User,
    @Body() updateData: Partial<{ name: string; matricula: string }>,
  ) {
    return this.usersService.update(user.id, updateData);
  }

  // DELETE /users/me — deletar própria conta
  @Delete('me')
  deleteAccount(@CurrentUser() user: User): Promise<{ message: string }> {
    return this.usersService.remove(user.id);
  }

  // GET /users/by-ids?ids=id1,id2 — buscar múltiplos usuários por IDs (professor/admin)
  @Get('by-ids')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  findByIds(@Query('ids') ids: string) {
    const idList = ids ? ids.split(',').map(id => id.trim()).filter(Boolean) : [];
    return this.usersService.findByIds(idList);
  }

  // GET /users/:id — buscar qualquer usuário (professor ou admin)
  @Get(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}