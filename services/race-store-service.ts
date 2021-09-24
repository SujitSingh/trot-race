import RaceTableModel from '../models/race-table-model';
import { HorseModel } from '../models/race-data-model';

class RaceStoreService {
  saveRaceStatus(horsesEvents = []) {
    // store race events differently in DB on their event-status
    const startEvents = [],
          finishEvents = [];
    for (const horse of horsesEvents) {
      if (horse.event === 'start') {
        startEvents.push(this.createHorseObj(horse));
      } else {
        finishEvents.push(this.createHorseObj(horse));
      }
    }
    const insertPromises = [],
          updatePromises = [];
    const updateObj = {
      inserted: [], // new entry with event as "start"
      updated: [] // new or update with event as "finish"
    };

    if (startEvents.length) {
      // add new entry for "start" type event
      insertPromises.push(RaceTableModel.insertMany(startEvents));
    }
    if (finishEvents.length) {
      // update/add entries for "finish" events
      for (const horse of finishEvents) {
        updatePromises.push(
          RaceTableModel.updateOne(
            { _id: horse.id },
            {
              $set: {
                event: horse.event,
                finishTime: horse.finishTime
              }
            },
            { upsert: true }
          )
        );
        // add horseId to be deleted
        updateObj.updated.push(horse.horseId);
      }
    }
    return Promise.all([...insertPromises, ...updatePromises]).then(response => {
      const respLen = response && response.length || 0;
      if (!respLen) {
        return updateObj;
      }
      const respInsert = response.slice(0, insertPromises.length);
      if (respInsert.length) {
        // add created _id for "start" type events
        const inserts = respInsert[0];
        for (const insert of inserts) {
          updateObj.inserted.push({
            id: insert._id.toString(),
            horseId: insert.horseId
          });
        }
      }
      return updateObj;
    });
  }
  createHorseObj(horse: HorseModel) {
    const horseObj: HorseModel = {
      event: horse.event,
      horseId: horse.horseId,
      horseName: horse.horseName,
      startTime: horse.startTime,
      finishTime: horse.finishTime || undefined
    };
    if (horse.id) {
      horseObj.id = horse.id; // the DB row ID
    }
    return horseObj;
  }
}

export = new RaceStoreService();