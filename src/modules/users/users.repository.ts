import { User, UserWithoutId } from './interfaces/user';
import { UserParameters } from './interfaces/parameters';
import { userDocToUser } from '../../mappers/user.mapper';
import { connection } from '../../main';

class UserRepository {
  async findByEmail(email: User['email']): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users WHERE email = ?`, [email], function (error, results, fields) {
        if (error) {
          console.log(error);
          return reject(error);
        } else if (results[0] === undefined) {
          return resolve(null);
        } else {
          return resolve(userDocToUser(results[0]));
        }
      });
    });
  }

  async findById(id: User['id']): Promise<User | null> {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users WHERE user_id = ?`, [id], function (error, results, fields) {
        if (error) {
          console.log(error);
          return reject(error);
        } else if (results[0] === undefined) {
          return resolve(null);
        } else {
          return resolve(userDocToUser(results[0]));
        }
      });
    });
  }

  async update(id, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users
        SET first_name = '${user.name}',
        last_name = '${user.surname}',
        age = ${user.age},
        email = '${user.email}',
        phone_number = ${user.tel},
        user_role = '${user.role}',
        user_password = '${user.password}'
        WHERE user_id = ?`,
        [id],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          } else {
            return resolve(this.findByEmail(user.email));
          }
        }
      );
    });
  }

  delete(id: User['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query(`DELETE FROM users WHERE user_id = ?`, [id], function (error, results, fields) {
        if (error) {
          console.log(error);
          return reject(error);
        } else {
          return resolve();
        }
      });
    });
  }

  async create(user: UserWithoutId): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO users (first_name, last_name, age, email, phone_number, user_role, user_password)
        VALUES ('${user.name}', '${user.surname}', ${user.age}, '${user.email}', ${user.tel}, '${user.role}', '${user.password}')`,
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          } else {
            return resolve(this.findByEmail(user.email));
          }
        }
      );
    });
  }

  async findAndSort(parameters: UserParameters): Promise<User[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM users';
      if (parameters.filterBy && parameters.filterText) {
        query += ` WHERE ${parameters.filterBy} = ${parameters.filterText}`;
      }
      if (parameters.sortBy && parameters.direction) {
        query += ` ORDER BY ${parameters.sortBy} ${parameters.direction}`;
      }
      if (parameters.limit) {
        query += ` LIMIT ${parameters.limit}`;
      }
      if (parameters.skip) {
        query += ` OFFSET ${parameters.skip}`;
      }
      connection.query(query, function (error, results, fields) {
        if (error) {
          console.log(error);
          return reject(error);
        } else {
          return resolve(results.map(userDocToUser));
        }
      });
    });
  }
}

const userRepository = new UserRepository();
export { userRepository };
