import raceService from './services/race-service';

class App {
  initiateApp() {
    raceService.initiateRaceChecks();
  }
}

export = new App();