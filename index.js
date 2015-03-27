var argv    = require('minimist')(process.argv.slice(2));
var path    = require('path');
var engines = require('./lib/engines');
var pkg     = require('./lib/package');
var assert  = require('assert');
var fs      = require('fs');
var os      = require('os');

assert(argv.engine, 'Must specify engine');
assert(argv._[0], 'Must specify package');
assert(Object.keys(engines).indexOf(argv.engine) !== -1, 'Invalid engine');

var pkgFile = path.join(__dirname, argv._[0]);
assert(fs.existsSync(pkgFile), 'Invalid package path');

var engine = engines[argv.engine];
var pkgData = pkg.read(path.join(__dirname, argv._[0]));

engine
  .resolveVersion({ engines: pkgData.engines })
  .then(function (version) {
    process.stdout.write(version + os.EOL);
  });
