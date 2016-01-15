const Sinon = require('sinon');
const Proxyquire = require('proxyquire');
const Lab = require('lab');
const Code = require('code');

var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;

var requestMock = Sinon.stub();
const VersionFixture = require('../../fixtures/npm.json');

const Engine = Proxyquire('../../../lib/engines/npm', {
  'request': requestMock
});

describe('engines/npm', function () {
  beforeEach(function (done) {
    requestMock.yields(null, null, JSON.stringify(VersionFixture));
    done();
  });

  afterEach(function (done) {
    requestMock.reset();
    done();
  });

  describe('#resolveVersion', function () {
    describe('when fetching versions fails', function () {
      beforeEach(function (done) {
        Sinon.stub(Engine, 'fetchVersions', function () {
          return {
            then: function (success, fail) {
              fail(new Error('fail'));
            }
          };
        });

        done();
      });

      afterEach(function (done) {
        Engine.fetchVersions.restore();
        done();
      });

      it('rejects the promise', function (done) {
        Engine.resolveVersion({ engines: {} }).fail(function (err) {
          expect(err).to.be.an.instanceOf(Error);
          done();
        });
      });
    });

    describe('when no version is specified', function () {
      it('returns the latest version of npm', function (done) {
        Engine.resolveVersion({ engines: {} })
          .then(function (version) {
            expect(version).to.equal('2.7.3');
            done();
          });
      });
    });

    describe('when a valid version is specified', function () {
      it('returns the specified version', function (done) {
        var opts = { engines: { 'npm': '1.1.25' } };
        Engine.resolveVersion(opts)
          .then(function (version) {
            expect(version).to.equal('1.1.25');
            done();
          });
      });
    });
  });

  describe('#fetchVersions', function () {
    describe('when a request fails', function () {
      beforeEach(function (done) {
        requestMock.yields(new Error('request failed'), null, null);
        done();
      });

      it('rejects the promise', function (done) {
        Engine.fetchVersions().fail(function (err) {
          expect(err).to.be.an.instanceOf(Error);
          done();
        });
      });
    });

    it('retrieves a list of all versions of npm', function (done) {
      Engine.fetchVersions().then(function (versions) {
        expect(versions.all).to.include(Object.keys(VersionFixture.versions));
        done();
      });
    });

    it('retrieves the latest version of npm', function (done) {
      Engine.fetchVersions().then(function (versions) {
        expect(versions.latest).to.equal('2.7.3');
        done();
      });
    });
  });
});
