const trotApiService = require('./trot-api-service.js');

class RaceService {
  // for handling different activity of the race
  refreshDelay = 1000; // 1000ms
  async initiateRace() {
    try {
      const respObj = await trotApiService.authenticateUser();
      const data = respObj.data;
      trotApiService.setAuthToken(data.token);
      this.initiateRaceStartCheck();
    } catch(error) {
      console.log(error);
    }
  }
  async initiateRaceStartCheck() {
    try {
      const response = await trotApiService.getRaceStatus();
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new RaceService();