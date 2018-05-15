module.exports = {
  dev: {
    server: {
      port: 9000
    },
    log: {
      filename: __dirname + '/logs/log.txt',
      maxsize: 1024 * 1024,
      maxFiles: 10,
      level: 'debug'
    },
    sendErrorToClient: true,
    reload: true
  },

  test: {
    server: {
      port: 9001
    },
  },

  prod: {
    server: {
      port: 9100
    },
    log: {
      filename: __dirname + '/logs/log.txt',
      maxsize: 1024 * 1024,
      maxFiles: 10,
      level: 'info'
    }
  }
};
