const Logger = require('./logger');

const NORMALIZED_FIELDS = [
  { key: 'engines', value: {} }
];

exports.normalize = function (pkg) {
  Logger.debug('normalizing package fields');

  NORMALIZED_FIELDS.forEach(function (f) {
    pkg[f.key] = pkg[f.key] || f.value;
  });

  return pkg;
};

exports.read = function (packagePath) {
  Logger.debug('reading package from %s', packagePath);

  try {
    return exports.normalize(require(packagePath)); // eslint-disable-line global-require
  } catch (e) {
    return false;
  }
};
