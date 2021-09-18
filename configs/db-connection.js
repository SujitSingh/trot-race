const mongoose = require('mongoose');
const config = require('./config.js');

class MongoConnection {
  connectDB() {
    return mongoose.connect(config.mongoDBPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

module.exports = new MongoConnection();