const crypto = require('crypto');

const key = crypto
  .randomBytes(16)
  .toString('hex');

module.exports = key;
