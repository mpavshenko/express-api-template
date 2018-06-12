const pjson = require('./package.json');
const logSetup = require('./logSetup.js');
const log = require('winston');
const moment = require('moment');
const request = require('request-promise-native');
const Server = require('./server.js');

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const config = require('./config.js')[env];
if (!config) throw new Error('configuration not found ' + env);
moment.locale('ru');

function logStartupInfo() {
  const startupMsg =
    `\n\tStarting server v${pjson.version}\n` +
    `\tNode ${process.version}\n` +
    `\tNODE_ENV: ${env}\n`;

  log.info(startupMsg);
  log.info(JSON.stringify(config, null, 4));
}

async function runServer() {
  const server = new Server({ config, log });
  await server.listen();
  log.info('Getting server version...');
  const version = await request(`http://localhost:${config.server.port}/version`);
  log.info(version);

  return server;
}

async function main() {
  logSetup.configure(config.log);
  logStartupInfo(env);

  const server = await runServer();

  process.on('SIGINT', async () => {
    mics.forEach(mic => mic.stop());
    await server.close();
    process.exit(0);
  });
}

main().catch(log.error);
