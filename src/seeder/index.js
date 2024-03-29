const dotenv = require('dotenv');
const seedBudget = require('./seed-budget');
const seedUser = require('./seed-user');
const ConnectDB = require('../configs/database');
const seedProfile = require('./seed-profile');
const seedExpense = require('./seed-expense');
const seedAlert = require('./seed-alert');

const seeder = async () => {
  dotenv.config();
  ConnectDB();
  await seedUser();
  await seedProfile();
  await seedExpense();
  await seedBudget();
  await seedAlert();
  process.exit(0);
};

seeder();
