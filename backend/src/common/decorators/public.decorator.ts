import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Use @Public() em rotas que não precisam de token (login, cadastro, health check)
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);