import { UserParameters } from './parameters';
import { User, UserWithoutId } from './user';

export interface IUserService {
  create(user: UserWithoutId): Promise<User>;
  findById(id: User['id']): Promise<User>;
  find(parameters: UserParameters): Promise<User[]>;
  update(callerUser: User, idUserToUpdate: User['id'], userToUpdate: User): Promise<User>;
  delete(callerUser: User, idUserToDelete: User['id']): Promise<void>;
  login(email: User['email'], password: User['password']): Promise<String>;
}
