var Q        = require('q');
var logger   = require('../logger');
var versions = require('../versions');
var semver   = require('semver');

exports.resolveVersion = function (options) {
  var deferred = Q.defer();

  versions
    .getIojsVersions()
    .then(function(versions) {
      logger.info('matching iojs version: %s', options.engines.iojs || 'undefined');
      var version = semver.maxSatisfying(versions.all, options.engines.iojs || null) || versions.latest;
      logger.debug('iojs version resolved to %s', version || versions.latest);
      deferred.resolve(version);
    });

  return deferred.promise;
};
