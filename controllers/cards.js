const mongoose = require('mongoose');

const card = require('../models/card');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');

module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  card
    .create({ name, link, owner: req.user._id })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Сервер не смог обработать запрос');
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new BadRequest('Некорректный ID');
  }
  return card
    .findById(req.params.cardId)
    .orFail(new NotFound('Карточка не найдена'))
    .then((foundCard) => {
      if (foundCard.owner.toString() !== req.user._id) {
        throw new Forbidden('Вы не являетесь обладателем карточки');
      }
      return card
        .findByIdAndDelete(req.params.cardId)
        .then(() => res.send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch(next);
};
