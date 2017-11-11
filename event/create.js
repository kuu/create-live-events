const config = require('config');
const OoyalaApi = require('ooyala-api');

const api = new OoyalaApi(config.api.key, config.api.secret, {subdomain: 'live', secure: true});

function createEvents(scheduleId, startTime, eventNum) {
  const offset = new Date(startTime);

  console.log(`scheduleId=${scheduleId}, startTime=${startTime}, eventNum=${eventNum}`);

  if (offset instanceof Date === false || !Number.isInteger(eventNum)) {
    throw new TypeError('Invalid param');
  }

  console.log(`Creating ${eventNum} events`);

  return api.get('/v3/schedules', {limit: 500}, {recursive: true})
  .then(schedules => {
    for (const schedule of schedules) {
      if (schedule.id === scheduleId) {
        return schedule;
      }
    }
    throw new Error(`No such schedule: ${scheduleId}`);
  })
  .then(schedule => {
    const events = createEventList(schedule, offset, eventNum);
    const promises = [];
    for (const event of events) {
      promises.push(api.post('/v3/events', {}, event));
    }
    return Promise.all(promises);
  })
  .then(events => {
    for (const event of events) {
      console.log(event);
      console.log('---');
    }
    console.log('Done');
  })
  .catch(err => {
    console.log(err.stack);
  });
}

function getTimeString(date) {
  const year = date.getUTCFullYear();
  const month = `00${date.getUTCMonth() + 1}`.slice(-2);
  const day = `00${date.getUTCDate()}`.slice(-2);
  const hh = `00${date.getUTCHours()}`.slice(-2);
  const mm = `00${date.getUTCMinutes()}`.slice(-2);
  const ss = `00${date.getUTCSeconds()}`.slice(-2);
  return `${year}-${month}-${day}T${hh}:${mm}:${ss}Z`;
}

function createEvent(schedule, name, description, start, end) {
  const startStr = getTimeString(start);
  const endStr = getTimeString(end);

  return api.post('/v3/events', {}, {
    name,
    description,
    image_height: '150',
    image_width: '250',
    track_id: schedule.id,
    status: 'offline',
    override_channel_id: schedule.channel_id,
    start_time: startStr,
    end_time: endStr,
    virtual_asset: {
      name,
      metadata: {
        channel_id: schedule.channel_id,
        archive: '0',
        trim: '0',
        override: '0',
        dvrwindow: '1800',
        autostart_enabled: '0',
        autostart_minutes: '0',
        autostop_minutes: '0'
      }
    }
  });
}

function createEventList(schedule, startTime, num) {
  const promises = [];
  let offset = startTime.getTime();
  for (let i = 0; i < num; i++, offset += 3600000) {
    const p = createEvent(
      schedule,
      `Program-${i}`,
      `A program for ${schedule.name}`,
      new Date(offset),
      new Date(offset + 1800000)
    );
    promises.push(p);
  }
  return promises;
}

module.exports = createEvents;
