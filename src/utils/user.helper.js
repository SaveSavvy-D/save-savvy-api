const bcrypt = require('bcryptjs');

const hashpassword = async (password) => bcrypt.hash(password, 12);

const comparePassword = async (reqPassword, dbPassword) => {
  const result = bcrypt.compareSync(reqPassword, dbPassword);

  return result;
};

module.exports = {
  hashpassword,
  comparePassword,
};
