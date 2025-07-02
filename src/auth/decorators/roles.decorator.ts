// roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [ROLE, ...ROLE[]]) =>
  SetMetadata(ROLES_KEY, roles);
