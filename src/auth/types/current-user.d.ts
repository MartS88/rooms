import { ROLE } from '../enums/role.enum';

export type CurrentUser = {
  id: number;
  role: ROLE;
};
