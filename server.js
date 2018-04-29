const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ut = require('./utils.js');
const version = require('./package.json').version;

const apiVersion = '0.0.1';

module.exports = function ({ config, log }) {
  const app = express();
  app.use(cors());
  app.use(function (req, res, next) {
    log.debug(`${req.method} ${req.originalUrl}`);
    next();
  });

  app.get('/version', (req, res, next) => {
    res.json({ version, apiVersion });
  })

  app.get('/error', () => {
    throw new Error('Test error')
  });

  app.get('/await', ut.sync(async (req, res) => {
    await ut.wait(10);
    res.send('await ok');
  }))

  app.use(function (err, req, res, next) {
    log.error(`${req.method} ${req.originalUrl}\n${err.stack}`);
    const error = config.sendErrorToClient
      ? err.message
      : 'Internal server error';
    res.status(500).send({ error })
  });

  let appInstance;

  this.listen = async () => {
    log.info('Starting http server ...');
    appInstance = await app.listen(config.server.port);
    log.info('Server listening at ' + config.server.port);
  };

  this.close = async () => {
    log.info('Stopping HTTP server...');
    await appInstance.close();
    log.info('Server stopped');
  }

  this.express = app;
};