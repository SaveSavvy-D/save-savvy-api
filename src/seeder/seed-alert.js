const { faker } = require('@faker-js/faker');
const { Budget, Alert } = require('../models');

const seedAlert = async () => {
  const budgets = await Budget.find();
  if (!budgets.length) {
    console.log('No budget found');
    return;
  }
  for (let i = 0; i < 10; i++) {
    const alertAttr = {
      budget: budgets[Math.floor(Math.random() * budgets.length)].id,
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      thresholdPercentage: '25%',
    };

    try {
      const alert = new Alert(alertAttr);
      await alert.save();
      console.log(`Alert created: ${alert.id} for [ Budget: ${alert.budget} ]`);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = seedAlert;
