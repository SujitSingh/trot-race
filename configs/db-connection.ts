import mongoose from 'mongoose';
import config from './config';

class MongoConnection {
  connectDB() {
    return mongoose.connect(config.mongoDBPath);
  }
}

export = new MongoConnection();