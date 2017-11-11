const minimist = require('minimist');

const listSchedules = require('./list');

const argv = minimist(process.argv.slice(2));
const command = argv._[0];

if (command === 'show') {
  listSchedules().then(() => console.log('Done'));
} else {
  throw new Error(`Unsupported command: "${command}"`);
}
