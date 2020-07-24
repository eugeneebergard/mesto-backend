const mongoose = require('mongoose');
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

module.exports = mongoose.model('user', usersSchema);
