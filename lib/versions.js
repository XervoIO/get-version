var request = require('request');
var Q       = require('q');
var semver  = require('semver');
var _       = require('lodash');
var logger  = require('./logger');

const SEMVER_REGEX = /[0-9]+\.[0-9]+\.[0-9]+/g;
const NODE_DIST_URL = 'http://nodejs.org/dist';
const IOJS_DIST_URL   = 'https://iojs.org/dist';

function fetchVersions (url) {
  var deferred = Q.defer();

  request.get(url, function (err, res, body) {
    if (err) return deferred.reject(err);

    var versions = [];
    var match;
    do {
      match = SEMVER_REGEX.exec(body);
      if (!match || versions.indexOf(match[0]) !== -1) continue;
      versions.push(match[0]);
    } while(match);

    versions.sort(semver.compareLoose);
    deferred.resolve(versions);
  });

  return deferred.promise;
}

exports.getNodeVersions = function () {
  var deferred = Q.defer();

  logger.debug('fetching versions from node.js dist');

  fetchVersions(NODE_DIST_URL)
    .then(function (nodeVersions) {
      nodeVersions.sort(semver.compareLoose);

      logger.debug('retrieved versions for node %j', nodeVersions, {});

      var latestStable = _.findLast(nodeVersions, function (v) {
        return semver(v).minor % 2 === 0;
      });

      deferred.resolve({ all: nodeVersions, latest: latestStable });
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

exports.getIojsVersions = function () {
  var deferred = Q.defer();

  logger.debug('fetching versions from iojs dist');

  fetchVersions(IOJS_DIST_URL)
    .then(function (ioVersions) {
      ioVersions.sort(semver.compareLoose);

      deferred.resolve({ all: ioVersions, latest: _.last(ioVersions) });
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};
