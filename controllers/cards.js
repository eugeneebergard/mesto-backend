const mongoose = require('mongoose');
const card = require('../models/card');

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card
    .create({ name, link, owner: req.user._id })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Некорректный ID' });
  }
  return card
    .findById(req.params.cardId)
    .orFail(() => new Error('Карточка не найдена'))
    .then((foundCard) => {
      if (foundCard.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'Вы не являетесь обладателем карточки' });
      }
      return card
        .findByIdAndDelete(req.params.cardId)
        .then(() => res.send({ message: 'Карточка удалена' }))
        .catch((err) => res.status(404).send({ message: err.message }));
    })
    .catch((err) => res.status(404).send({ message: err.message }));
};
