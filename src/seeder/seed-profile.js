const { faker } = require('@faker-js/faker');
const { Profile, User } = require('../models');

const seedProfile = async () => {
  for (let i = 0; i < 5; i++) {
    const users = await User.find();
    const profileAttr = {
      name: faker.name.firstName(),
      currency: 'PKR',
      earning_details: [{
        amount: faker.finance.amount(),
      }],
      user: users[Math.floor(Math.random() * users.length)].id,
    };
    try {
      console.log(profileAttr);
      const findProfile = await Profile.findOne({ user: profileAttr.user });
      if (findProfile) {
        console.log('Profile already exsist for this user');
        continue;
      }
      const profile = new Profile(profileAttr);
      await profile.save();
      console.log(`Profile created for user ${profile.user} with id ${profile.id}`);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = seedProfile;
