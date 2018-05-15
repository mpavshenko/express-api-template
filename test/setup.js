module.exports = function () {
  const Server = require('./../server.js');
  const log = require('winston');
  const config = require('./../config.js')['test'];
  const logSetup = require('./../logSetup.js');
  logSetup.configure();
  const server = new Server({ config, log });
  return { server };
}