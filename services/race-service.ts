
import mongoConnection from '../configs/db-connection';
import trotApiService from './trot-api-service';
import raceStoreService from './race-store-service';
import { HorseModel, RaceEventModel } from "../models/race-data-model";

class RaceService {
  // for handling different activity of the race
  MAX_HORSES = 6;
  checkEventDelay = 15 * 1000; // 15 seconds
  checkFinishedDelay = 60 * 1000 + 1000; // 1 min + 1s
  horsesMap: { [index: number]: HorseModel } = {};
  timeoutId = null;

  async initiateRace() {
    try {
      await mongoConnection.connectDB();
      console.info('MongoDB connected');

      console.info('App started');
      this.initiateRaceChecks();
    } catch(error) {
      console.info(error.message || 'Failed to connect DB', error);
    }
  }

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
      clearTimeout(this.timeoutId); // clear previous checks
      const response = await trotApiService.getRaceStatus();
      const data: RaceEventModel = response.data;
      this.storeResponse(data);
      if (data && data.event === 'start') {
        // fetch remaining 5 horses info
        this.getRemaining5HorsesInfo();
      } else if (data && data.event === 'finish') {
        // immediately check if race started
        this.initiateRaceStartCheck();
      } else {
        // race yet to start
        this.timeoutId = setTimeout(() => {
          this.initiateRaceStartCheck();
        }, this.checkEventDelay);
      }
    } catch (error) {
      this.handleAPIError(error);
    }
  }

  getRemaining5HorsesInfo() {
    const targetInfo = 5
    let completed = 0;
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
    // check and count all finished horses
    let completed = 0;
    for (let i = 0; i < this.MAX_HORSES; i++) {
      trotApiService.getRaceStatus().then(response => {
        const data = response.data;
        this.storeResponse(data);
      }).catch(error => {
        this.handleAPIError(error);
      }).finally(() => {
        if (++completed === this.MAX_HORSES) {
          // the current race finished
          this.processHorsesInfoSaving();
          this.initiateRaceStartCheck();
        }
      });
    }
  }

  storeResponse(resp: RaceEventModel) {
    if (!resp) {
      // save existing fetched infos to DB
      this.processHorsesInfoSaving();
      return;
    }
    const currentTime = Date.now(),
          event = resp.event;
    let horseInfo: HorseModel;
    if (this.horsesMap[resp.horse.id] && event === 'finish') {
      // updating existing info
      horseInfo = {
        ...this.horsesMap[resp.horse.id],
        event: 'finish',
        finishTime: currentTime + resp.time,
      }
    } else {
      // new entry info
      horseInfo = {
        event: event,
        horseId: resp.horse.id,
        horseName: resp.horse.name,
        startTime: event === 'finish' ? currentTime - resp.time : currentTime + resp.time,
        finishTime: event === 'finish' ? currentTime + resp.time : null,
      };
    }
    this.horsesMap[resp.horse.id] = horseInfo;
  }

  processHorsesInfoSaving() {
    this.saveHorsesInfoToDB(this.horsesMap);
  }
  async saveHorsesInfoToDB(horsesMapArg) {
    const horses = Object.values(horsesMapArg);
    try {
      console.info(horses);
      const savedObj = await raceStoreService.saveRaceStatus(horses);
      this.updateStartedHorsesEntry(savedObj.inserted);
      // delete inserted finished race
      const finishedHorseIds = savedObj.updated || [];
      this.removeSavedHorses(finishedHorseIds);
    } catch(error) {
      this.handleAPIError(error);
    }
  }
  updateStartedHorsesEntry(horsesEntry = []) {
    // add DB "id" identifier to started horse entries
    for (const horse of horsesEntry) {
      this.horsesMap[horse.horseId].id = horse.id;
    }
  }
  removeSavedHorses(horseIds: string[] = []) {
    // remove horses entry
    for (const id of horseIds) {
      delete this.horsesMap[id];
    }
  }

  handleAPIError(error) {
    clearTimeout(this.timeoutId);
    const errorStatus = error && error.status;
    if (errorStatus === 401) {
      this.initiateRaceChecks();
    } else if (errorStatus === 204) {
      this.initiateRaceStartCheck();
    } else {
      this.initiateRaceChecks();
    }
  }
}

const raceService = new RaceService();
raceService.initiateRace();

export = raceService;