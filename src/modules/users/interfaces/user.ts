import { Role } from '../../../enums/role';

export interface User {
  id: string;
  name: string;
  surname: string;
  age: number;
  email: string;
  tel: number;
  role: Role;
  password: string;
}

export type UserWithoutId = Omit<User, 'id'>;
export type UserWithoutPass = Omit<User, 'password'>;
