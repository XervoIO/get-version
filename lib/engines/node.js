const Q = require('q');
const Logger = require('../logger');
const Versions = require('../versions');
const Semver = require('semver');
const _ = require('lodash');
const Iojs = require('./iojs');

function resolveNodeVersion(desired, versions) {
  Logger.debug('resolving node version %s', desired || 'undefined');

  if (desired === 'latest' || desired === '*') {
    return versions.latest;
  }
  return Semver.maxSatisfying(versions.all, desired || null);
}

exports.resolveVersion = function (options) {
  var deferred = Q.defer();

  if (options.engines.iojs) return Iojs.resolveVersion(options);

  Versions
    .getNodeVersions()
    .then(function (versions) {
      var extendedOptions;
      var version = resolveNodeVersion(options.engines.node, versions);

      if (version) return deferred.resolve(version);
      if (!options.engines.node) {
        Logger.debug('no node version specified, using latest version');
        return deferred.resolve(versions.latest);
      }
      Logger.debug('no node version found, falling back to iojs');
      extendedOptions = _.extend(options, {
        engines: { iojs: options.engines.node },
        allowBlank: true
      });
      Iojs.resolveVersion(extendedOptions).then(function (ioVersion) {
        deferred.resolve(ioVersion || versions.latest);
      });
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};
