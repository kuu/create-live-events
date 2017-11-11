const minimist = require('minimist');

const listEvents = require('./list');
const deleteEvents = require('./delete');
const createEvents = require('./create');

const argv = minimist(process.argv.slice(2));
const command = argv._[0];

if (command === 'show') {
  listEvents().then(() => console.log('Done'));
} else if (command === 'delete') {
  deleteEvents().then(() => console.log('Done'));
} else if (command === 'create') {
  const params = argv._.slice(1);
  if (params.length  < 3) {
    throw new Error('At least 3 params should be specified: Schedule-ID, Start-Time, How many events to create.');
  }
  createEvents(...params).then(() => console.log('Done'));
} else {
  throw new Error(`Unsupported command: "${command}"`);
}
