const { faker } = require('@faker-js/faker');
const {
  User, Category, Expense,
} = require('../models');

const seedExpense = async () => {
  const users = await User.find();
  const categories = await Category.find();

  if (users.length === 0) {
    console.log('No user found');

    return;
  }
  if (categories.length === 0) {
    console.log('No category found');
  }
  for (let i = 0; i < 10; i++) {
    const expenseAttr = {
      user: users[Math.floor(Math.random() * users.length)].id,
      category: categories[Math.floor(Math.random() * categories.length)].id,
      title: faker.lorem.word(),
      amount: faker.finance.amount(),
    };

    try {
      const expense = new Expense(expenseAttr);

      await expense.save();
      console.log(`Expense created: ${expense.id} for [ User: ${expenseAttr.user}, Category: ${expenseAttr.category} ]`);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = seedExpense;
