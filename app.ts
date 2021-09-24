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
    worker.on('message', data => { });
    worker.on('error', error => { });
    worker.on('exit', code => {
      console.log('Exiting');
    });
  }
}

export = new App();