import { User, UserWithoutPass } from '../modules/users/interfaces/user';

export const userDocToUser = (user: any): User => {
  const existingUser: User = {
    id: user.user_id,
    name: user.first_name,
    surname: user.last_name,
    age: user.age,
    email: user.email,
    tel: user.phone_number,
    role: user.user_role,
    password: user.user_password,
  };
  return existingUser;
};

export const userDocToUserWithoutPass = (user: User): UserWithoutPass => {
  const existingUser: UserWithoutPass = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    age: user.age,
    email: user.email,
    tel: user.tel,
    role: user.role,
  };
  return existingUser;
};
