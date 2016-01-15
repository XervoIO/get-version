const Request = require('request');
const Q = require('q');
const Semver = require('semver');
const _ = require('lodash');
const Logger = require('./logger');

const SEMVER_REGEX = /[0-9]+\.[0-9]+\.[0-9]+/g;
const NODE_DIST_URL = 'http://nodejs.org/dist';
const IOJS_DIST_URL = 'https://iojs.org/dist';
const NOT_FOUND = -1;

function fetchVersions(url) {
  var deferred = Q.defer();

  Request.get(url, function (err, res, body) {
    var versions = [];
    var match;

    if (err) return deferred.reject(err);

    do {
      match = SEMVER_REGEX.exec(body);
      if (!match || versions.indexOf(match[0]) !== NOT_FOUND) continue;
      versions.push(match[0]);
    } while (match);

    versions.sort(Semver.compareLoose);
    deferred.resolve(versions);
  });

  return deferred.promise;
}

exports.getNodeVersions = function () {
  var deferred = Q.defer();

  Logger.debug('fetching versions from node.js dist');

  fetchVersions(NODE_DIST_URL)
    .then(function (nodeVersions) {
      var latestStable;

      nodeVersions.sort(Semver.compareLoose);
      Logger.debug('retrieved versions for node %j', nodeVersions, {});

      latestStable = _.findLast(nodeVersions, function (v) {
        return Semver(v).minor % 2 === 0;
      });

      deferred.resolve({ all: nodeVersions, latest: latestStable });
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

exports.getIojsVersions = function () {
  var deferred = Q.defer();

  Logger.debug('fetching versions from iojs dist');

  fetchVersions(IOJS_DIST_URL)
    .then(function (ioVersions) {
      ioVersions.sort(Semver.compareLoose);

      deferred.resolve({ all: ioVersions, latest: _.last(ioVersions) });
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};
