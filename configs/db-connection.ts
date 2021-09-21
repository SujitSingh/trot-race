import mongoose from 'mongoose';
import config from './config';

class MongoConnection {
  connectionObj;
  async connectDB() {
    if (this.connectionObj) {
      return this.connectionObj;
    }
    this.connectionObj = await mongoose.connect(config.mongoDBPath);
    return this.connectionObj;
  }
  closeConnection() {
    this.connectionObj.connection.close();
  }
}

export = new MongoConnection();