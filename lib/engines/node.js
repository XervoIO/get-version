var Q        = require('q');
var logger   = require('../logger');
var versions = require('../versions');
var semver   = require('semver');
var _        = require('lodash');

function resolveNodeVersion (desired, versions) {
  var version;

  logger.debug('resolving node version %s', desired || 'undefined');

  if (desired === 'latest') {
    version = _.findLast(versions.all, function (v) { return semver(v).minor % 2 === 0; });
  } else {
    version = semver.maxSatisfying(versions.all, desired || null);
  }

  return version;
}

exports.resolveVersion = function (options) {
  var deferred = Q.defer();

  if (options.engines.iojs) deferred.reject(); //TODO: support iojs engine

  versions
    .getNodeVersions()
    .then(function(versions) {
      var version = resolveNodeVersion(options.engines.node, versions);
      if (!version) {
        if (options.engines.node) {
          logger.info('no node version found, falling back to iojs');
          //fall back to iojs
        } else {
          logger.info('no node version specified, using latest version %s', versions.latest);
          version = versions.latest;
        }
      }
      deferred.resolve(version);
    });

  return deferred.promise;
};
