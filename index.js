var engines = require('./lib/engines');
var assert  = require('assert');
var pkg     = require('./lib/package');

module.exports = function (engStr, pkgFile) {

  assert(pkgFile, 'Must specify package file');
  var pkgData = pkg.read(pkgFile);

  assert(pkgData, 'Invalid package file specified');
  assert(engStr, 'Must specify engine');
  assert(Object.keys(engines).indexOf(engStr) !== -1, 'Invalid engine');

  return engines[engStr].resolveVersion({ engines: pkgData.engines });
};
