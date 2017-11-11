const config = require('config');
const OoyalaApi = require('ooyala-api');

const api = new OoyalaApi(config.api.key, config.api.secret, {subdomain: 'live'});

function deleteEvents() {
  return api.get('/v3/events', {limit: 500}, {recursive: true})
  .then(events => {
    console.log(`Deleting ${events.length} events`);
    return deleteAll(events);
  })
  .then(() => {
    console.log('Done');
  })
  .catch(err => {
    console.log(err.stack);
  });
}

function deleteAll(events) {
  const promises = [];
  for (const event of events) {
    const p = api.delete(`/v3/events/${event.id}`);
    promises.push(p);
  }
  return Promise.all(promises);
}

module.exports = deleteEvents;
