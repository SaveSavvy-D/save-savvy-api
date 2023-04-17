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
      const findProfile = await Profile.findOne({ user: profileAttr.user });

      if (findProfile) {
        console.log('Profile already exsist for this user');
        continue;
      }
      const profile = new Profile(profileAttr);

      await profile.save();
      console.log(`Profile created: ${profile.id} for [ User: ${profile.user}`);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = seedProfile;
