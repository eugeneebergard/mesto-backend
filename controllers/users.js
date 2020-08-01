const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BadRequest = require('../errors/badRequest');
const Conflict = require('../errors/conflict');
const NotFound = require('../errors/notFound');
const user = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password || password.length < 8) {
    throw new BadRequest('Задайте пароль не менее 8 символов');
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) => user.create({
      name, about, avatar, email, password: hash,
    }))
    .then((users) => res.send({
      data:
      {
        name: users.name,
        about: users.about,
        avatar: users.avatar,
        email: users.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.errors.email && err.errors.email.kind === 'unique') {
          throw new Conflict('Пользователь с таким E-mail уже существует');
        } else {
          throw new BadRequest('Неверный синтаксис');
        }
      }
    })
    .catch(next);
};

module.exports.getUser = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    throw new BadRequest('Некорректный ID');
  }
  user
    .findById(req.params.userId)
    .orFail(new NotFound('Пользователь с таким id не найден'))
    .then((userr) => {
      res.send(userr);
    })
    .catch(next);
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (password) {
    return user.findUserByCredentials(email, password)
      .then((userObj) => {
        const token = jwt.sign({ _id: userObj._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.send({ token });
      })
      .catch(next);
  }
  return res.status(400).send({ message: 'Необходимо ввести пароль' });
};
