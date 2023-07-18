const getCurrentYearMonth = () => {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

const getGivenYearMonth = (date) => {
  const now = new Date(date);

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

const getPageSkipLimit = (page) => {
  if (page === 'all') {
    return { skip: 0, limit: 0 };
  }
  const limit = 5;
  const skip = limit * (parseInt(page) - 1);

  return { skip, limit };
};

module.exports = {
  getCurrentYearMonth,
  getPageSkipLimit,
  getGivenYearMonth,
};
