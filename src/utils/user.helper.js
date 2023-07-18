const bcrypt = require('bcryptjs');

const hashpassword = async (password) => bcrypt.hash(password, 12);

const comparePassword = async (reqPassword, dbPassword) => {
  const result = bcrypt.compareSync(reqPassword, dbPassword);

  return result;
};

const getPercentage = (percentage) => {
  const percent = parseInt(percentage.split('%')[0], 10);

  return percent;
};

module.exports = {
  hashpassword,
  comparePassword,
  getPercentage,
};
