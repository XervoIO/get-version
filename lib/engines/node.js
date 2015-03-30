var Q        = require('q');
var logger   = require('../logger');
var versions = require('../versions');
var semver   = require('semver');
var _        = require('lodash');
var iojs     = require('./iojs');

function resolveNodeVersion (desired, versions) {
  logger.debug('resolving node version %s', desired || 'undefined');

  if (desired === 'latest' || desired === '*') {
    return versions.latest;
  }
  return semver.maxSatisfying(versions.all, desired || null);
}

exports.resolveVersion = function (options) {
  var deferred = Q.defer();

  if (options.engines.iojs) return iojs.resolveVersion(options);

  versions
    .getNodeVersions()
    .then(function(versions) {
      var version = resolveNodeVersion(options.engines.node, versions);
      if (version) return deferred.resolve(version);
      if (!options.engines.node) {
        logger.debug('no node version specified, using latest version');
        return deferred.resolve(versions.latest);
      }
      logger.debug('no node version found, falling back to iojs');
      var extendedOptions = _.extend(options, {
        engines: { iojs: options.engines.node },
        allowBlank: true
      });
      iojs.resolveVersion(extendedOptions).then(function (ioVersion) {
        deferred.resolve(ioVersion || versions.latest);
      });
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};
