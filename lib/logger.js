const Winston = require('winston');

module.exports = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      handleExceptions: true,
      timestamp: true,
      level: process.env.LOG_LEVEL || 'info' // eslint-disable-line no-process-env
    })
  ]
});
