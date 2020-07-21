/* eslint-disable no-console */
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const notFound = (req, res) => {
  if (!res.headersSent) {
    res.status(404).send({
      message: 'Запрашиваемый ресурс не найден',
    });
  }
};

app.use((req, res, next) => {
  req.user = {
    _id: '5f15e9a77a84711dd87a6f10',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(notFound);

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(`localhost:${PORT}`);
});
