const Request = require('request');
const Semver = require('semver');
const Q = require('q');
const Logger = require('../logger');

const NPM_REGISTRY_URL = 'http://registry.npmjs.org/npm';

exports.resolveVersion = function (options) {
  var deferred = Q.defer();

  exports
    .fetchVersions()
    .then(function (versions) {
      var version = Semver.maxSatisfying(versions.all, options.engines.npm || null) || versions.latest;

      Logger.debug('matching npm version: %s', options.engines.npm || 'undefined');
      Logger.debug('npm version resolved to %s', version);
      deferred.resolve(version);
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

exports.fetchVersions = function () {
  var deferred = Q.defer();

  Logger.debug('fetching versions for npm');

  Request(NPM_REGISTRY_URL, function (err, response, body) {
    var data, result;

    if (err) return deferred.reject(err);

    data = JSON.parse(body);
    result = {
      all: Object.keys(data.versions).sort(Semver.compareLoose),
      latest: data['dist-tags'].latest
    };
    Logger.debug('retrieved versions for npm %j', result, {});
    deferred.resolve(result);
  });

  return deferred.promise;
};
