import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { adminUserService } from '../users/admin.users.service';

export const tokenValidation = (req: Request, res, next) => {
  if (req.path == '/login') {
    return next();
  }
  const token = req.headers['auth-token'];
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }
  jwt.verify(token.toString(), process.env.SECRET_KEY, async (error, decodedToken: { id: string }) => {
    if (error) {
      res.status(401).send('Unauthorized');
      return;
    }
    req.user = await adminUserService.findById(decodedToken.id);
    return next();
  });
};
