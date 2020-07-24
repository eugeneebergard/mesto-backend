const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = require('../jwtcrypto');

const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name, about, avatar, email, password: hash,
    }))
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUser = async (req, res) => {
  try {
    const userObj = await user
      .findById(req.params.userId)
      .orFail(new Error(`Пользователь с таким _id ${req.params.userId} не найден`));
    return res.json({ userObj });
  } catch (err) {
    return res.status(404).send({ message: err.message });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (password) {
    return user.findUserByCredentials(email, password)
      .then((userObj) => {
        const token = jwt.sign({ _id: userObj._id }, key, { expiresIn: '7d' });
        res.send({ token });
      })
      .catch((err) => {
        res.status(401).send({ message: err.message });
      });
  }
  return res.status(400).send({ message: 'Необходимо ввести пароль' });
};
