var request = require('request');
var semver  = require('semver');
var Q       = require('q');
var logger  = require('../logger');

const NPM_REGISTRY_URL = 'http://registry.npmjs.org/npm';

exports.resolveVersion = function (options) {
  var deferred = Q.defer();

  exports
    .fetchVersions()
    .then(function (versions) {
      logger.info('matching npm version: %s', options.engines.npm || 'undefined');
      var version = semver.maxSatisfying(versions.all, options.engines.npm || null) || versions.latest;
      logger.debug('npm version resolved to %s', version);
      deferred.resolve(version);
    });

  return deferred.promise;
};

exports.fetchVersions = function () {
  var deferred = Q.defer();

  logger.info('fetching versions for npm');

  request(NPM_REGISTRY_URL, function (err, response, body) {
    if (err) return deferred.reject(err);
    var data = JSON.parse(body);
    var result = {
      all: Object.keys(data.versions).sort(semver.compareLoose),
      latest: data['dist-tags'].latest
    };
    logger.debug('retrieved versions for npm %j', result, {});
    deferred.resolve(result);
  });

  return deferred.promise;
};
