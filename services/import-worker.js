const { workerData } = require('worker_threads');
 
require('ts-node').register();
require(workerData.path); // load the compiled version of given file for worker destination