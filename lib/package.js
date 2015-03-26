var logger  = require('./logger');

const NORMALIZED_FIELDS = [
  { key: 'engines', value: {} }
];

exports.normalize = function (pkg) {
  logger.info('normalizing package fields');

  NORMALIZED_FIELDS.forEach(function(f) {
    pkg[f.key] = pkg[f.key] || f.value;
  });

  return pkg;
};

exports.read = function (packagePath) {
  logger.info('reading package from %s', packagePath);

  try {
    return exports.normalize(require(packagePath));
  } catch (e) {
    return false;
  }
};
