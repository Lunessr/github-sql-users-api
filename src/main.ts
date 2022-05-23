import * as express from 'express';
import * as dotenv from 'dotenv';
import {} from './modules/users/users.controller';
import * as bodyParser from 'body-parser';
import { tokenValidation } from './modules/middlewares/authMiddleware';
import { router } from './routes';
import * as mysql from 'mysql';
import * as process from 'process';

const server = express();
dotenv.config();

export const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
    return err;
  }
  console.log(`Connected as id ${connection.threadId}`);
});

server.use(bodyParser.json());
server.use(tokenValidation);
server.use(router);

server.get('/', (req: express.Request, res) => {
  res.send('<h1>Home page</h1>');
});

server.use((req, res) => {
  res.status(404).send('error');
});

server.listen(3000, () => {
  console.log(`Server started`);
});

process.on('SIGINT', function () {
  console.log('\ngracefully shutting down from SIGINT (Crtl-C)');
  process.exit();
});

process.on('exit', function () {
  connection.end();
  console.log('Connection close');
});
