# ooyala-live

## Install
```
$ git clone git@github.com:kuu/ooyala-live.git
$ cd ooyala-live
$ npm install
```

## Config
Put config file(s) in your work directory.
```js
 $ mkdir config
 $ vi config/default.json
 {
   "api": {
     "key":        "Your Ooyala API Key",
     "secret":     "Your Ooyala API Secret"
   }
 }
```

## Usage
```
# Show schedules
$ npm run schedule show

# Show events
$ npm run event show

# Delete all events
$ npm run event delete

# Create events (30min event with 30min intervals)
$ npm run event create {schedule-id} {start-time} {how-many-events-to-create}
# Example for creating 3 events:
$ npm run event create abcde12345 "2017-11-11 13:30" 3

```
