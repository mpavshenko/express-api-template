module.exports = function () {
  const Server = require('./../server.js');
  const log = require('winston');
  const config = require('./../config.js')['test'];
  const server = new Server({ config, log });
  return { server };
}