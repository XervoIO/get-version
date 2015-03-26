var expect     = require('chai').expect;
var sinon      = require('sinon');
var fs         = require('fs');
var path       = require('path');
var pkg        = require('../../lib/package');

describe('package', function () {

  var pkgPath = path.join(__dirname, '../fixtures/package.json');
  var pkgFixture = JSON.parse(fs.readFileSync(pkgPath));

  describe('#read', function () {
    beforeEach(function () {
      sinon.stub(pkg, 'normalize').returnsArg(0);
    });

    afterEach(function () {
      pkg.normalize.restore();
    });

    it('reads a package.json', function () {
      expect(pkg.read(pkgPath)).to.eql(pkgFixture);
    });

    it('normalizes the output', function () {
      pkg.read(pkgPath);
      expect(pkg.normalize.callCount).to.equal(1);
    });
  });

  describe('#normalize', function () {

    it('adds the engines key if one does not exist', function () {
      expect(pkg.normalize({})).to.eql({ engines: {} });
    });

  });

});
