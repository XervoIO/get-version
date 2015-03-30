# get-version

Parse package.json files and determine a version for npm, node or iojs.

## Installation

`$ npm install get-version`

## Usage

There are 3 supported engines: npm, node and iojs.

### Command Line

```
$ get-version --engine <engine> package.json
```

### CommonJS

get-version returns a promise.

```js
var getVersion = require('get-version');

getVersion('npm', './package.json').then(success, failure);
```

### Notes

get-version will use semantic versioning to find versions for both npm and iojs if one is not specified.

Since node uses it's own versioning system, semantic versioning is not used to find node versions. It uses the following rules to evaluate node versions:

* If `latest` or `*` are specified, the latest stable version of node will be used.
* If a valid node version cannot be found, get-version will attempt to find an appropriate version of iojs and use it instead.
* If neither a node nor iojs version can be found, the latest stable version of node will be used.
* If the node engine is requested, but an iojs key/value is present in the engines property of the package.json
