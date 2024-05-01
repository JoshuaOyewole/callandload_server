const bcrypt = require("bcryptjs");

const hashData = (data) => {
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(data, salt);

  return hashed;
};
const verifyHashedData = (unhashed, hashed) => {
  const match = bcrypt.compareSync(unhashed, hashed);
  return match;
};

module.exports = { hashData, verifyHashedData };
