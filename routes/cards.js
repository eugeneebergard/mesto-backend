const path = require('path');
const fs = require('fs').promises;
const cardsRouter = require('express').Router();

const cards = path.join(__dirname, '../data/cards.json');

const cardsArr = async () => JSON.parse(await fs.readFile(cards, { encoding: 'utf8' }));

cardsRouter.get('/', async (req, res) => {
  res.send(await cardsArr());
});

module.exports = cardsRouter;
