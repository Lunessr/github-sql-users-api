const ERROR_MESSAGES = {
  ALREADY_CREATED: 'User already created',
  ID_NOT_EXIST: 'Current id is not exist',
  NO_SUCH_EMAIL: 'No user with such email',
  INCORRECT_LOGIN: 'Wrong login or password',
  NO_AUTHORIZE: 'Unauthorized',
  NO_SUCH_ROLE: 'No such role. Choose Admin or Customer',
};

const errors = new Map().set(ERROR_MESSAGES.ALREADY_CREATED, {
  message: 'User already created with this email',
  status: 400,
});
errors.set(ERROR_MESSAGES.ID_NOT_EXIST, {
  message: 'Current id is not exist',
  status: 404,
});
errors.set(ERROR_MESSAGES.NO_SUCH_EMAIL, {
  message: 'No user with such email',
  status: 404,
});
errors.set(ERROR_MESSAGES.INCORRECT_LOGIN, {
  message: 'Wrong login or password',
  status: 400,
});
errors.set(ERROR_MESSAGES.NO_AUTHORIZE, {
  message: 'Unauthorized',
  status: 401,
});
errors.set(ERROR_MESSAGES.NO_SUCH_ROLE, {
  message: 'No such role. Choose Admin or Customer',
  status: 400,
});

const handleError = (res, error) => {
  const err = errors.get(error.message);
  if (err) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send(error.message);
  }
};

export { errors, ERROR_MESSAGES, handleError };
