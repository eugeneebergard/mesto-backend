const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    uniqoe: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

// eslint-disable-next-line func-names
usersSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      });
    });
};

usersSchema.plugin(mongooseUniqueValidator, { message: 'Пользователь с таким E-Mail уже существует' });
module.exports = mongoose.model('user', usersSchema);
