const Path = require('path');

const Sinon = require('sinon');
const Lab = require('lab');
const Code = require('code');

const Pkg = require('../../lib/package');

var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;

var pkgPath = Path.join(__dirname, '../fixtures/package.json');
const PkgFixture = require(pkgPath);

describe('package', function () {
  describe('#read', function () {
    beforeEach(function (done) {
      Sinon.stub(Pkg, 'normalize').returnsArg(0);
      done();
    });

    afterEach(function (done) {
      Pkg.normalize.restore();
      done();
    });

    it('reads a package.json', function (done) {
      expect(Pkg.read(pkgPath)).to.equal(PkgFixture);
      done();
    });

    it('normalizes the output', function (done) {
      Pkg.read(pkgPath);
      expect(Pkg.normalize.callCount).to.equal(1);
      done();
    });

    describe('when a package is not found', function () {
      it('returns false', function (done) {
        expect(Pkg.read(null)).to.be.false();
        done();
      });
    });
  });

  describe('#normalize', function () {
    it('adds the engines key if one does not exist', function (done) {
      expect(Pkg.normalize({})).to.be.an.object();
      expect(Pkg.normalize({})).to.include('engines');
      done();
    });
  });
});
