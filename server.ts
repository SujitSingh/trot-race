require('dotenv').config();
import mongoConnection from './configs/db-connection';
import app from './app';

mongoConnection.connectDB().then(connection => {
  console.log('MongoDB connected');
  // initialize the app
  app.initiateApp();
}).catch(error => {
  console.log(error.message || 'Failed to start server', error);
});
