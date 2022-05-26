import { User, UserWithoutId } from './interfaces/user';
import { IUserService } from './interfaces/user.servise.interface';
import { userRepository } from '../users/users.repository';
import { ERROR_MESSAGES } from '../../errors';
import { UserParameters } from './interfaces/parameters';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Role } from '../../enums/role';

class CustomerUserService implements IUserService {
  async create(user: UserWithoutId): Promise<User> {
    console.log('');
    return {
      id: 'string',
      name: 'string',
      surname: 'string',
      age: 1,
      email: 'string',
      tel: 1,
      role: Role.CUSTOMER,
      password: 'string',
    };
  }

  async findById(id: User['id']): Promise<User> {
    const existingUser = await userRepository.findById(id);
    if (existingUser === null || existingUser.role === Role.ADMIN) {
      throw new Error(ERROR_MESSAGES.ID_NOT_EXIST);
    }
    return existingUser;
  }

  async find(parameters: UserParameters): Promise<User[]> {
    const { filter, sortBy = 'first_name', direction, limit = 3, skip = 0 } = parameters;
    let existingUsers = await userRepository.findAndSort({
      filter: { user_role: Role.CUSTOMER, ...filter },
      sortBy,
      direction,
      limit,
      skip,
    });
    return existingUsers.filter((user) => user.role === Role.CUSTOMER);
  }

  async update(callerUser: User, idUserToUpdate: User['id'], userToUpdate: User): Promise<User> {
    const userWithId = await userRepository.findById(idUserToUpdate);
    if (userWithId === null || userWithId.id !== callerUser.id) {
      throw new Error(ERROR_MESSAGES.ID_NOT_EXIST);
    }
    const userWithEmail = await userRepository.findByEmail(userToUpdate.email);
    if (userWithEmail === null) {
      throw new Error(ERROR_MESSAGES.ALREADY_CREATED);
    }
    const updatedUser = await userRepository.update(idUserToUpdate, userToUpdate);
    return updatedUser;
  }

  async delete(callerUser: User, idUserToDelete: User['id']): Promise<void> {
    const existingUser = await userRepository.findById(idUserToDelete);
    if (existingUser === null || existingUser.id !== callerUser.id) {
      throw new Error(ERROR_MESSAGES.ID_NOT_EXIST);
    }
    const deleted = await userRepository.delete(idUserToDelete);
    return deleted;
  }

  async login(email: User['email'], password: User['password']): Promise<String> {
    const userWithEmail = await userRepository.findByEmail(email);
    const userPassword = await bcrypt.compare(password, userWithEmail.password);
    if (userWithEmail === null || !userPassword) {
      throw new Error(ERROR_MESSAGES.INCORRECT_LOGIN);
    }
    return jwt.sign({ id: userWithEmail.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  }
}

const customerUserService = new CustomerUserService();
export { customerUserService };
