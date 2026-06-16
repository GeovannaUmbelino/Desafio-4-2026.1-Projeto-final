import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';

// Use @Roles(UserRole.PROFESSOR) para restringir uma rota a perfis específicos
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);