const mongoose = require('mongoose');

const reg = /^https?:\/\/(www\.)?(((?!www)\w([\w-]*\w)?\.)+([a-z]\w*)|(\d{1,3}\.){3}\d{1,3})(:\d+)?\/?(\/\w+)*(\/\w+(\.\w+)?(#|\/)?)*$/;

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
      validator: (v) => reg.test(v),
      message: 'Некорректный URL',
    },
    required: true,
  },
});

module.exports = mongoose.model('user', usersSchema);
