const config = require('config');
const OoyalaApi = require('ooyala-api');

const api = new OoyalaApi(config.api.key, config.api.secret, {subdomain: 'live'});

function listSchedules() {
  return api.get('/v3/schedules', {limit: 500}, {recursive: true})
  .then(events => {
    console.log(`${events.length} schedules are available`);
    for (const event of events) {
      logObject(event, '');
    }
  })
  .catch(err => {
    console.log(err.stack);
  });
}

function logObject(obj, prefix) {
  if (!prefix) {
    console.log(`{`);
  }
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'virtual_asset' || key === 'program' || key === 'adTech' || key === 'metadata') {
      console.log(`${prefix}\t${key}: {`);
      logObject(value, `${prefix}\t`);
    } else {
      console.log(`${prefix}\t${key}: ${value}`);
    }
  }
  console.log(`${prefix}}`);
}

module.exports = listSchedules;
