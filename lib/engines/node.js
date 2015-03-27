var Q        = require('q');
var logger   = require('../logger');
var versions = require('../versions');
var semver   = require('semver');
var _        = require('lodash');
var iojs     = require('./iojs');

function resolveNodeVersion (desired, versions) {
  var version;

  logger.debug('resolving node version %s', desired || 'undefined');

  if (desired === 'latest' || desired === '*') {
    return versions.latest;
  } else {
    version = semver.maxSatisfying(versions.all, desired || null);
  }

  return version;
}

exports.resolveVersion = function (options) {
  var deferred = Q.defer();

  if (options.engines.iojs) return iojs.resolveVersion(options);

  versions
    .getNodeVersions()
    .then(function(versions) {
      var version = resolveNodeVersion(options.engines.node, versions);
      if (!version) {
        if (options.engines.node) {
          logger.info('no node version found, falling back to iojs');
          var extendedOptions = _.extend(options, {
            engines: { iojs: options.engines.node },
            allowBlank: true
          });
          iojs.resolveVersion(extendedOptions).then(function (ioVersion) {
            deferred.resolve(ioVersion || versions.latest);
          });
        } else {
          logger.info('no node version specified, using latest version');
          deferred.resolve(versions.latest);
        }
      } else {
        deferred.resolve(version);
      }
    });

  return deferred.promise;
};
