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

### License

The MIT License (MIT)

Copyright (c) 2015 Modulus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
