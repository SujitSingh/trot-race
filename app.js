const express =  require('express');
const raceService = require('./services/race-service.js');

const app = express();

app.use((err, req, res,next) => {
  const status = err.statusCode || 500;
  re.status(status).send({
    message: err.message || 'Server error'
  });
});

class App {
  initiateApp() {
    raceService.initiateRace();
  }
}

module.exports = new App();