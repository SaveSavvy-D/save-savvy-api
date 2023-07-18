const { faker } = require('@faker-js/faker');
const { Budget, User, Category } = require('../models');

const seedBudget = async () => {
  const users = await User.find();
  const categories = await Category.find();

  if (users.length === 0) {
    console.log('No user found');

    return;
  }
  if (categories.length === 0) {
    console.log('No category found');

    return;
  }
  for (let i = 0; i < 10; i++) {
    const budgetAttr = {
      threshold: faker.datatype.number(),
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      userId: users[Math.floor(Math.random() * users.length)].id,
      categoryId: categories[Math.floor(Math.random() * categories.length)].id,
    };

    try {
      const existingBudget = await Budget.findOne({
        userId: budgetAttr.userId,
        categoryId: budgetAttr.categoryId,
        startDate: { $lte: budgetAttr.endDate },
        endDate: { $gte: budgetAttr.startDate },
      });

      if (existingBudget) {
        console.log('Budget already exists for this category in this month');
        continue;
      }
      const budget = new Budget(budgetAttr);

      await budget.save();
      console.log(`Budget created: ${budget.id} for [User: ${budget.userId}, Category: ${budget.categoryId}]`);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = seedBudget;
