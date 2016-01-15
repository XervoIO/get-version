const Engines = require('./lib/engines');
const Assert = require('assert');
const Pkg = require('./lib/package');

const NOT_FOUND = -1;

module.exports = function (engStr, pkgFile) {
  var pkgData = pkgFile ? Pkg.read(pkgFile) : { engines: {} };

  Assert(pkgData, 'Invalid package file specified');
  Assert(engStr, 'Must specify engine');
  Assert(Object.keys(Engines).indexOf(engStr) !== NOT_FOUND, 'Invalid engine');

  return Engines[engStr].resolveVersion({ engines: pkgData.engines });
};
