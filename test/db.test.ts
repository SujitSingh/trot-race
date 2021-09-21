require('dotenv').config(); // for environment variables

import mongoConnection from '../configs/db-connection';
import RaceTableModel from '../models/race-table-model';
import { HorseModel } from '../models/race-data-model';

describe('MongoDB connection', () => {
  it ('should connect successfully', async () => {
    const connection = await mongoConnection.connectDB();
    expect(connection).toBeTruthy();
  });

  afterAll(done => {
    done();
  });
});

describe('MongoDB operations', () => {
  const randomHorseId = Math.floor(Math.random() * 1000); // for random horseId
  const sampelEntry: HorseModel = {
    event: 'finish',
    horseId: randomHorseId,
    horseName: 'Test Horse',
    startTime: Date.now(),
    finishTime: Date.now() + 1000
  };
  let entryId: string;

  beforeAll(done => {
    // remove any previous entry with same randomHorseId
    RaceTableModel.findOneAndDelete({ horseId: randomHorseId }).then(resp => {
      done();
    });
  });

  it ('should not have entry with generated random-horse-id', async () => {
    const resp = await RaceTableModel.findOne({ horseId: randomHorseId });
    expect(resp).toBeNull();
  });
  it ('should add new entry successfully', async () => {
    const raceEntry = new RaceTableModel(sampelEntry);
    const response = await raceEntry.save();
    entryId = response._id.toString(); // assign new entry ID for later use
    expect(response).toBeTruthy();
  });
  it ('should have data if searched by ID', async () => {
    const resp = await RaceTableModel.findById(entryId);
    expect(resp).toBeDefined();
  });
  it ('should have entry data if searched by random-horse-id', async () => {
    const resp = await RaceTableModel.findOne({ horseId: randomHorseId });
    expect(resp).toBeDefined();
  });
  it ('should delete entry with given ID', async () => {
    const resp = await RaceTableModel.findByIdAndDelete(entryId);
    expect(resp && resp._id.toString()).toBe(entryId);
  });
  it ('should not have entry of deleted ID', async () => {
    const resp = await RaceTableModel.findById(entryId);
    expect(resp).toBeNull();
  });

  afterAll( (done) => {
    mongoConnection.closeConnection(); // close existing connection
    done();
  });
});
