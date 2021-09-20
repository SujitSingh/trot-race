const raceService = require('./services/race-service.js');

class App {
  initiateApp() {
    raceService.initiateRaceChecks();
  }
}

module.exports = new App();