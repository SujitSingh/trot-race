require('dotenv').config();
const http = require('http');
const config = require('./configs/config.js');
const mongoConnection = require('./configs/db-connection.js');

const app = require('./app.js');
const PORT = config.PORT;

const server = http.createServer(app);

mongoConnection.connectDB().then(connection => {
  console.log('MongoDB connected');
  server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
    // initialize the app
    app.initiateApp();
  }).on('error', error => {
    console.log('Server error -', error);
  });
}).catch(error => {
  console.log(error.message || 'Failed to start server', error);
});
