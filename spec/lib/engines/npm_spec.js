var expect     = require('chai').expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');

var requestMock    = sinon.stub();
var versionFixture = require('../../fixtures/npm.json');

var engine = proxyquire('../../../lib/engines/npm', {
  'request': requestMock
});

describe('engines/npm', function () {
  beforeEach(function () {
    requestMock.yields(null, null, JSON.stringify(versionFixture));
  });

  afterEach(function () {
    requestMock.reset();
  });

  describe('#resolveVersion', function () {
    describe('when fetching versions fails', function () {
      beforeEach(function () {
        sinon.stub(engine, 'fetchVersions', function () {
          return {
            then: function (success, fail) {
              fail(new Error('fail'));
            }
          };
        });
      });

      afterEach(function () {
        engine.fetchVersions.restore();
      });

      it('rejects the promise', function (done) {
        engine.resolveVersion({ engines: {} }).fail(function (err) {
          expect(err).to.be.an.instanceOf(Error);
          done();
        });
      });
    });

    describe('when no version is specified', function () {
      it('returns the latest version of npm', function (done) {
        engine.resolveVersion({ engines: {}})
          .then(function(version) {
            expect(version).to.equal('2.7.3');
            done();
          });
      });
    });

    describe('when a valid version is specified', function () {
      it('returns the specified version', function (done) {
        var opts = { engines: { 'npm': '1.1.25' }};
        engine.resolveVersion(opts)
          .then(function(version) {
            expect(version).to.equal('1.1.25');
            done();
          });
      });
    });
  });

  describe('#fetchVersions', function () {
    describe('when a request fails', function () {
      beforeEach(function () {
        requestMock.yields(new Error('request failed'), null, null);
      });

      it('rejects the promise', function (done) {
        engine.fetchVersions().fail(function (err) {
          expect(err).to.be.an.instanceOf(Error);
          done();
        });
      });
    });

    it('retrieves a list of all versions of npm', function (done) {
      engine.fetchVersions().then(function (versions) {
        expect(versions.all).to.have.members(Object.keys(versionFixture.versions));
        done();
      });
    });

    it('retrieves the latest version of npm', function (done) {
      engine.fetchVersions().then(function (versions) {
        expect(versions.latest).to.equal('2.7.3');
        done();
      });
    });
  });

});
