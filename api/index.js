const express = require('express');
const log = require('winston');


module.exports = function ({ config }) {
  const apiVersion = '0.0.1';
  const router = express.Router();

  router.get('/ping', (req, res) => {
    log.info(req.user);
    res.send('pong');
  }); 

  router.get('/conf', (req, res) => {
    res.send(config);
  });

  router.use('/status', require('./status.js'));

  return router;
}