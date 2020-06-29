const path = require('path');
const fs = require('fs').promises;
const usersRouter = require('express').Router();

const users = path.join(__dirname, '../data/users.json');

const usersArr = async () => (JSON.parse(await fs.readFile(users, { encoding: 'utf8' })));

// eslint-disable-next-line no-underscore-dangle
const userId = async (id) => (await usersArr()).find((user) => user._id === id);

usersRouter.get('/', async (req, res) => {
  res.send(await usersArr());
});

usersRouter.get('/:id', async (req, res) => {
  const user = await userId(req.params.id);
  if (user) {
    res.send(user);

    return;
  }
  res.status(404).send({ message: 'Нет пользователя с таким id' });
});

module.exports = usersRouter;
