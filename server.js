require('dotenv').config();
const mongoConnection = require('./configs/db-connection.js');

const app = require('./app.js');

mongoConnection.connectDB().then(connection => {
  console.log('MongoDB connected');
  // initialize the app
  app.initiateApp();
}).catch(error => {
  console.log(error.message || 'Failed to start server', error);
});
