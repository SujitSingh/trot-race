import { Worker } from 'worker_threads';
import path from 'path';

class App {
  initiateApp() {
    // initialize the app worker
    const worker = new Worker('./services/import-worker.js', {
      workerData: {
        path: path.resolve('./services/race-service.ts')
      }
    });
    worker.on('message', data => { console.info(data) });
    worker.on('error', error => { console.info(error) });
    worker.on('exit', code => {
      console.info('Exiting -', code);
    });
  }
}

export = new App();