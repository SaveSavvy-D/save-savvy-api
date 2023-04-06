const mongoose = require('mongoose');

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDb connected...');
  } catch (error) {
    console.log(`Connection to MongoDB failed with ${error}`);
  }
};

module.exports = ConnectDB;
