import { ERROR_MESSAGES, handleError } from '../../errors';
import { UserParameters } from './interfaces/parameters';
import { userDocToUserWithoutPass } from '../../mappers/user.mapper';
import { User } from './interfaces/user';
import { Role } from '../../enums/role';
import { usersFactory } from '../users/users.factory';

const addUser = async (req, res) => {
  const { name, surname, age, email, tel, role, password } = req.body;
  try {
    if (role !== Role.ADMIN && role !== Role.CUSTOMER) {
      throw new Error(ERROR_MESSAGES.NO_SUCH_ROLE);
    }
    const userService = usersFactory.chooseUserService(req.user);
    const createdUser = await userService.create({ name, surname, age, email, tel, role, password });
    res.status(201).send(userDocToUserWithoutPass(createdUser));
  } catch (error) {
    handleError(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    const userService = usersFactory.chooseUserService(req.user);
    const user = await userService.findById(req.params.id);
    res.status(200).json(userDocToUserWithoutPass(user));
  } catch (error) {
    handleError(res, error);
  }
};

const getUsers = async (req, res): Promise<void> => {
  const { filterBy, filterText, sortBy, direction, limit, skip } = req.query;

  try {
    const userService = usersFactory.chooseUserService(req.user);
    const users = await userService.find({
      filterBy,
      filterText,
      sortBy,
      direction,
      limit: Number(limit),
      skip: Number(skip),
    } as UserParameters);
    res.status(200).send(users.map(userDocToUserWithoutPass));
  } catch (error) {
    handleError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.body.role !== Role.ADMIN && req.body.role !== Role.CUSTOMER) {
      throw new Error(ERROR_MESSAGES.NO_SUCH_ROLE);
    }
    const userService = usersFactory.chooseUserService(req.user);
    const updatedUser: User = await userService.update(req.user, req.params.id, req.body);
    res.status(200).json(userDocToUserWithoutPass(updatedUser));
  } catch (error) {
    handleError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userService = usersFactory.chooseUserService(req.user);
    await userService.delete(req.user, req.params.id);
    res.status(200).json('Current user is deleted');
  } catch (error) {
    handleError(res, error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userService = usersFactory.chooseUserService(req.user);
    const userToken = await userService.login(email, password);
    res.send(userToken);
  } catch (error) {
    handleError(res, error);
  }
};

export { addUser, getUser, getUsers, updateUser, deleteUser, loginUser };
