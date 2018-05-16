const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ut = require('./utils.js');
const auth = require('./auth.js');
const version = require('./package.json').version;
const path = require('path');
const reload = require('reload');
const process = require('process');

module.exports = function ({ config, log }) {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json({limit: '1mb'}));

  app.use(function (req, res, next) {
    log.debug(`${req.method} ${req.originalUrl}`);
    next();
  });

  app.get('/version', (req, res, next) => {
    res.json({ version });
  })

  app.get('/error', () => {
    throw new Error('Test error');
  });

  app.get('/await', ut.sync(async (req, res) => {
    await ut.wait(10);
    res.send('await ok');
  }));


  app.get('/api/user', auth, (req, res) => {
    res.send(req.user);
  });

  app.post('/api/login', ut.sync(async (req, res) => {
    var login = req.query.login || req.body.login;
    var password = req.query.password || req.body.password;
    log.debug(login + ' ' + password);

    if (login == 'admin' || password == 'admin') {
      res.send({ access_token: 'mytoken' });
    }
    else {
      res.status(401).send('Unauthorized');
    }
  }));

  app.use('/api', auth, require('./api'));

  const facePath = path.join(__dirname, 'face');
  app.use('/', express.static(facePath));

  app.use(function (err, req, res, next) {
    log.error(`${req.method} ${req.originalUrl}\n${err.stack}`);
    const error = config.sendErrorToClient
      ? err.message
      : 'Internal server error.';
    res.status(500).send({ error });
  });

  if (config.reload) {
    reload(app);
  }

  let appInstance;

  this.listen = async () => {
    log.info('Starting http server ...');
    appInstance = await app.listen(config.server.port);
    log.info('Server listening at ' + config.server.port);
  };

  this.close = async () => {
    log.info('Stopping HTTP server...');
    await appInstance.close();
    process.exit(0);
    log.info('Server stopped');
  }

  this.app = app;
};