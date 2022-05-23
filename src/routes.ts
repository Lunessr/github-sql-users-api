import * as express from 'express';
import { addUser, getUser, getUsers, updateUser, deleteUser, loginUser } from './modules/users/users.controller';

const router = express.Router();

router.post('/users', addUser);
router.get('/users/:id', getUser);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', loginUser);

export { router };
