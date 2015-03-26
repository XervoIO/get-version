var winston = require('winston');

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      timestamp: true,
      level: process.env.LOG_LEVEL || 'info'
    })
  ]
});
