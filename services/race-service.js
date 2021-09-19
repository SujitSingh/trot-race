const trotApiService = require('./trot-api-service.js');

class RaceService {
  // for handling different activity of the race
  MAX_HORSES = 6;
  checkEventDelay = 15 * 1000; // 15 seconds
  checkFinishedDelay = 60 * 1000; // 1 min
  horsesMap = {};
  intervalId = null;

  async initiateRaceChecks() {
    try {
      const respObj = await trotApiService.authenticateUser();
      const data = respObj.data;
      trotApiService.setAuthToken(data.token);
      this.initiateRaceStartCheck();
    } catch(error) {
      this.handleAPIError(error);
    }
  }

  async initiateRaceStartCheck() {
    try {
      console.log('race start check');
      const response = await trotApiService.getRaceStatus();
      const data = response.data;
      this.storeResponse(data);
      if (data && data.event === 'start') {
        // fetch remaining 5 horses info
        this.getRemaining5HorsesInfo();
      } else if (data && data.event === 'finish') {
        // immediately check if race started
        this.initiateRaceStartCheck();
      } else {
        // race yet to start
        setTimeout(() => {
          this.initiateRaceStartCheck();
        }, this.checkEventDelay);
      }
    } catch (error) {
      this.handleAPIError(error);
    }
  }

  getRemaining5HorsesInfo() {
    console.log('getting remaining horses');
    let completed = 0, targetInfo = 5;
    for (let i = 0; i < targetInfo; i++) {
      trotApiService.getRaceStatus().then(response => {
        const data = response.data;
        if (data) {
          this.storeResponse(data);
        }
      }).catch(error => {
        this.handleAPIError(error);
      }).finally(() => {
        if (++completed === targetInfo) {
          console.log('all horses started');
          this.processHorsesInfoSaving();
          // wait for 60 secs and check for finished status
          setTimeout(() => {
            this.getRaceFinishedInfo();
          }, this.checkFinishedDelay);
        }
      });
    }
  }

  getRaceFinishedInfo() {
    console.log('race finish check');
    let completed = 0;
    for (let i = 0; i < this.MAX_HORSES; i++) {
      trotApiService.getRaceStatus().then(response => {
        const data = response.data;
        this.storeResponse(data);
      }).catch(error => {
        this.handleAPIError(error);
      }).finally(() => {
        if (++completed === this.MAX_HORSES) {
          console.log('last race finished');
          this.processHorsesInfoSaving();
          // the current race finished
          this.initiateRaceStartCheck();
        }
      });
    }
  }

  storeResponse(resp) {
    console.log(resp);
    if (!resp) {
      // save existing fetched infos to DB
      this.processHorsesInfoSaving();
      return;
    }
    const currentTime = Date.now(),
          event = resp.event;
    let horseInfo = {};
    if (this.horsesMap[resp.horse.id] && event === 'finish') {
      horseInfo = {
        ...this.horsesMap[resp.horse.id],
        event: 'finish',
        finishTime: currentTime + resp.time,
      }
    } else {
      horseInfo = {
        event: event,
        horseId: resp.horse.id,
        horseName: resp.horse.name,
        startTime: currentTime + resp.time,
      };
    }
    this.horsesMap[resp.horse.id] = horseInfo;
  }

  processHorsesInfoSaving() {
    console.log('saving horses info -', this.horsesMap);
    this.saveHorsesInfoToDB(this.horsesMap);
  }
  saveHorsesInfoToDB(horsesMapArg = {}) {
    const horses = Object.values(horsesMapArg);
    const horsesIds = horses.reduce((prev, horse) => {
      let newArray = prev;
      if(horse.event === 'finish') {
          newArray.push(horse.horseId);
      }
      return newArray;
    }, [])
    this.removeSavedHorses(horsesIds);
  }
  removeSavedHorses(horseIds = []) {
    for (let id of horseIds) {
      delete this.horsesMap[id];
    }
    console.log('remaining horses ', this.horsesMap);
  }

  handleAPIError(error) {
    const errorStatus = error && error.status;
    this.intervalId = clearInterval(this.intervalId);
    if (errorStatus === 401) {
      this.initiateRaceChecks();
    } else if (errorStatus === 204) {
      this.initiateRaceStartCheck();
    } else {
      this.initiateRaceChecks();
    }
  }
}

module.exports = new RaceService();