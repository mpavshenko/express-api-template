const router = require('express').Router();
const log = require('winston');
const process = require('process');
const moment = require('moment');
const os = require('os');

module.exports = router;

router.get('', (req, res) => {
  const mem = process.memoryUsage();

  data = {
    time: {
      server: moment().format()
    },
    // version: {
    //   app: pjson.version,
    //   node: process.version,
    //   enviroment: env
    // },
    uptime: {
      process: uptimeFormat(process.uptime()),
      system: uptimeFormat(os.uptime())
    },
    memory: {
      heapTotal: bytesToSize(mem.heapTotal),
      heapUsed: bytesToSize(mem.heapUsed),
      rss: bytesToSize(mem.rss)
    },
    system: {
      freeMem: bytesToSize(os.freemem()),
      totalMem: bytesToSize(os.totalmem())
    }
  };

  res.send(data);
});

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function uptimeFormat(s) {
  var ss = Math.floor(s % 60);
  var m = Math.floor(s / 60);
  var mm = m % 60;
  var h = Math.floor(m / 60);
  var hh = h % 24;
  var d = Math.floor(h / 24);

  var time = moment.utc({ h: hh, m: mm, s: ss });
  return d + 'd ' + time.format('HH:mm:ss');
}
