const Q = require('q');
const Logger = require('../logger');
const Versions = require('../versions');
const Semver = require('semver');

exports.resolveVersion = function (options) {
  var deferred = Q.defer();

  Versions
    .getIojsVersions()
    .then(function (versions) {
      var version = Semver.maxSatisfying(versions.all, options.engines.iojs || null);

      Logger.debug('matching iojs version: %s', options.engines.iojs || 'undefined');
      if (!version && options.allowBlank) {
        Logger.debug('allowBlank set to true, iojs resolving to null');
        deferred.resolve(null);
      } else {
        Logger.debug('iojs version resolved to %s', version || versions.latest);
        deferred.resolve(version || versions.latest);
      }
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};
