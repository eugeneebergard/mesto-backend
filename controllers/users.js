const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.getUser = async function findById(req, res) {
  const User = await user.findById(req.params.userId);
  if (User == null) {
    res.status(404).send({ message: 'Пользователь не найден' });
    return;
  }
  res.send({ User });
};
