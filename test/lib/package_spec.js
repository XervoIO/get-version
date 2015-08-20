var fs = require('fs');
var path = require('path');

var sinon = require('sinon');
var Lab = require('lab');
var Code = require('code');

var pkg = require('../../lib/package');

var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;

describe('package', function () {

  var pkgPath = path.join(__dirname, '../fixtures/package.json');
  var pkgFixture = require(pkgPath);

  describe('#read', function () {
    beforeEach(function (done) {
      sinon.stub(pkg, 'normalize').returnsArg(0);
      done();
    });

    afterEach(function (done) {
      pkg.normalize.restore();
      done();
    });

    it('reads a package.json', function (done) {
      expect(pkg.read(pkgPath)).to.equal(pkgFixture);
      done();
    });

    it('normalizes the output', function (done) {
      pkg.read(pkgPath);
      expect(pkg.normalize.callCount).to.equal(1);
      done();
    });

    describe('when a package is not found', function () {
      it('returns false', function (done) {
        expect(pkg.read(null)).to.be.false;
        done();
      });
    });
  });

  describe('#normalize', function () {

    it('adds the engines key if one does not exist', function (done) {
      expect(pkg.normalize({})).to.be.an.object();
      expect(pkg.normalize({})).to.include('engines');
      done();
    });

  });

});
