const FS = require('fs');
const Path = require('path');

// auto load all other js files in folder
const DIR = Path.join(__dirname, '/');

FS.readdirSync(DIR).forEach(function (file) { // eslint-disable-line no-sync
  var name = file.replace('.js', '');
  var path = Path.join('./', name);

  if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
    exports[name] = require(path); // eslint-disable-line global-require
  }
});
