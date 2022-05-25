import { User, UserWithoutId } from './interfaces/user';
import { IUserService } from './interfaces/user.servise.interface';
import { userRepository } from './users.repository';
import { ERROR_MESSAGES } from '../../errors';
import { UserParameters } from './interfaces/parameters';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

class AdminUserService implements IUserService {
  async create(user: UserWithoutId): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    const existingUser = await userRepository.findByEmail(user.email);
    if (existingUser !== null) {
      throw new Error(ERROR_MESSAGES.ALREADY_CREATED);
    }
    return userRepository.create(user);
  }

  async findById(id: User['id']): Promise<User> {
    const existingUser = await userRepository.findById(id);
    if (existingUser === null) {
      throw new Error(ERROR_MESSAGES.ID_NOT_EXIST);
    }
    return existingUser;
  }

  async find(parameters: UserParameters): Promise<User[]> {
    const { filterBy, filterText, sortBy, direction, limit, skip } = parameters;
    return userRepository.findAndSort({ filterBy, filterText, sortBy, direction, limit, skip });
  }

  async update(callerUser: User, idUserToUpdate: User['id'], userToUpdate: User): Promise<User> {
    const userWithId = await userRepository.findById(idUserToUpdate);
    if (userWithId === null) {
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
    if (existingUser === null) {
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

const adminUserService = new AdminUserService();
export { adminUserService };
