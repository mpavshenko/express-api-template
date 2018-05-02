const bodyParser = require('body-parser');
const router = require('express').Router();
const log = require('winston');


module.exports = router;

apiVersion = '0.0.1';

// Распарсим тело запроса (каждого)
router.use(bodyParser.json({limit: '1mb'}));

// Для проверки
router.get('/ping', (req, res) => {
  log.info(req.user);
  res.send('pong');
});

// router.use('/tournaments', require('./tournaments.js'));
// router.use('/players', require('./players.js'));