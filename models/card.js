const mongoose = require('mongoose');

const reg = /^https?:\/\/(www\.)?(((?!www)\w([\w-]*\w)?\.)+([a-z]\w*)|(\d{1,3}\.){3}\d{1,3})(:\d+)?\/?(\/\w+)*(\/\w+(#|\/))*$/;

const cardsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator: (v) => reg.test(v),
      message: 'Некорректный URL',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardsSchema);
