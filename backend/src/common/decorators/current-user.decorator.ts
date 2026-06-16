import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

// Use @CurrentUser() em vez de @Req() req: Request para pegar o usuário logado
// Exemplo: async getProfile(@CurrentUser() user: User)
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);