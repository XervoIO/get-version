var expect     = require('chai').expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');
var Q          = require('q');

var versionServiceMock = {
  getIojsVersions: function () {
    var q = Q.defer();
    q.resolve({
      all: ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0', '1.2.0', '1.3.0', '1.4.1', '1.4.2', '1.4.3', '1.5.0', '1.5.1', '1.6.0', '1.6.1', '1.6.2'],
      latest: '1.6.2'
    });
    return q.promise;
  }
};

var engine = proxyquire('../../../lib/engines/iojs', {
  '../versions': versionServiceMock
});

describe('engines/iojs', function () {

  describe('#resolveVersion', function () {

    describe('when fetching versions fails', function () {
      beforeEach(function () {
        sinon.stub(versionServiceMock, 'getIojsVersions', function () {
          var q = Q.defer();
          q.reject(new Error('fail'));
          return q.promise;
        });
      });

      afterEach(function () {
        versionServiceMock.getIojsVersions.restore();
      });

      it('rejects the promise', function (done) {
        engine.resolveVersion({ engines: {} }).fail(function (err) {
          expect(err).to.be.an.instanceOf(Error);
          done();
        });
      });
    });

    describe('when no version is specified', function () {
      it('returns the latest version', function (done) {
        engine.resolveVersion({ engines: {}})
          .then(function(version) {
            expect(version).to.equal('1.6.2');
            done();
          });
      });
    });

    describe('when a valid version is specified', function () {
      it('returns the specified version', function (done) {
        engine.resolveVersion({ engines: { 'iojs': '1.6.0' }})
          .then(function(version) {
            expect(version).to.equal('1.6.0');
            done();
          });
      });
    });

    describe('when an asterisk is provided', function () {
      it('returns the latest version', function (done) {
        engine.resolveVersion({ engines: { 'iojs': '*' }})
          .then(function(version) {
            expect(version).to.equal('1.6.2');
            done();
          });
      });
    });

    describe('when a tilde range is provided', function () {
      it('resolves the appropriate semantic version', function (done) {
        engine.resolveVersion({ engines: { 'iojs': '~1.0' }})
          .then(function(version) {
            expect(version).to.equal('1.0.4');
            done();
          });
      });
    });

    describe('when an caret range is provided', function () {
      it('resolves the appropriate semantic version', function (done) {
        engine.resolveVersion({ engines: { 'iojs': '^1.0.0' }})
          .then(function(version) {
            expect(version).to.equal('1.6.2');
            done();
          });
      });
    });

    describe('when an x-version is provided', function () {
      it('resolves the appropriate semantic version', function (done) {
        engine.resolveVersion({ engines: { 'iojs': '1.x' }})
          .then(function(version) {
            expect(version).to.equal('1.6.2');
            done();
          });
      });
    });

    describe('when an invalid version is provided', function () {
      it('returns the latest version', function (done) {
        engine.resolveVersion({ engines: { 'iojs': '5.0' }})
          .then(function(version) {
            expect(version).to.equal('1.6.2');
            done();
          });
      });

      describe('when allowBlank option is true', function () {
        it('returns null', function (done) {
          engine.resolveVersion({ engines: { 'iojs': '5.0' }, allowBlank: true})
            .then(function(version) {
              expect(version).to.be.null;
              done();
            });
        });
      });
    });
  });

});
