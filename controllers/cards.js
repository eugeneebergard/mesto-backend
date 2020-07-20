const card = require('../models/card');

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card
    .create({ name, link, owner: req.user._id })
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.deleteCard = async (req, res) => {
  const cardObj = await card.findByIdAndRemove(req.params.cardId);
  if (cardObj == null) {
    res.status(404).send({ message: 'Карточка не найдена' });
  } else {
    res.send({ cardObj });
  }
};
