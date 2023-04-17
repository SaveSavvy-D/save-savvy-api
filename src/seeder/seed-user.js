const { faker } = require('@faker-js/faker');
const { User } = require('../models');

const seedUser = async () => {
  for (let i = 0; i < 3; i++) {
    const userAttr = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    try {
      const findUser = await User.findOne({ email: userAttr.email });

      if (findUser) {
        console.log('User already exsists with this email');
        continue;
      }
      const user = new User(userAttr);

      await user.save();
      console.log(`New user added with id: ${user.id}`);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = seedUser;
