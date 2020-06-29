const path = require('path');
const express = require('express');
const usersArr = require('./routes/users');
const cardsArr = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

const notFound = (req, res) => {
  if (!res.headersSent) {
    res.status(404).send({
      message: 'Запрашиваемый ресурс не найден',
    });
  }
};

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', usersArr);
app.use('/cards', cardsArr);
app.use(notFound);

app.listen(PORT);
