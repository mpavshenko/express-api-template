const log = require('winston');
const fs = require('fs');
const path = require('path');

function nowStr() {
  var now = new Date();
  var DD = ii(now.getDate());
  var MM = ii(now.getMonth() + 1);
  var hh = ii(now.getHours());
  var mm = ii(now.getMinutes());
  var ss = ii(now.getSeconds());
  var mss = ii(now.getMilliseconds(), 3);
  
  function ii(i, len = 2) {
    var s = String(i);
    while (s.length < len) s = "0" + s;
    return s;
  }

  return `${DD}.${MM} ${hh}:${mm}:${ss}.${mss}`;
}

exports.configure = function (logConfig) {
  log.remove(log.transports.Console);

  let defaultConfig = {
    json: false,
    tailable: true,
    timestamp: nowStr,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    level: 'debug'
  };

  if (logConfig) {
    Object.assign(defaultConfig, logConfig);

    if (logConfig.filename) {
      var logFolder = path.dirname(logConfig.filename);
      if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder);
      }
    }

    log.add(log.transports.File, defaultConfig);
  }

  log.add(log.transports.Console, defaultConfig);
};