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

module.exports.getUser = async (req, res) => {
  try {
    const userObj = await user
      .findById(req.params.userId)
      .orFail(new Error(`Пользователь с таким _id ${req.params.userId} не найден`));
    return res.json({ userObj });
  } catch (err) {
    return res.status(404).send({ message: err.message });
  }
};
