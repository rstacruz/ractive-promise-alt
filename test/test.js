/* jshint expr: true */

var expect = require('chai').expect;
var Ractive = require('ractive');
var Promise = Ractive.Promise;

var isPromise;

describe('ractive-promise', function () {
  before(function () {
    require('../index');
  });

  function wait(ms, result) {
    return new Promise(function (done, raise) {
      setTimeout(function () {
        done(result);
      }, ms);
    });
  }

  function waitFail(ms, result) {
    return new Promise(function (done, raise) {
      setTimeout(function () {
        raise(result);
      }, ms);
    });
  }

  it('registers', function () {
    expect(Ractive.adaptors.promise).be.an('object');
    expect(Ractive.adaptors.promise.wrap).be.a('function');
    expect(Ractive.adaptors.promise.filter).be.a('function');
  });

  describe('filter', function () {
    before(function () {
      isPromise = Ractive.adaptors.promise.filter;
    });

    it('works for true promises', function () {
      var promise = wait(100);
      expect(isPromise(promise)).be.true;
    });

    it('works for non-promises', function () {
      expect(isPromise(1)).be.false;
    });
  });

  describe('with fulfilled promises', function () {
    var view, delay;

    beforeEach(function () {
      view = new Ractive({
        adapt: ['promise'],
        template:
          "{{#delay}}" +
          "pending[{{#pending}}true{{/pending}}] " +
          "result[{{result}}] " +
          "error[{{error}}] " +
          "{{/delay}}"
      });
    });

    it('sets pending', function () {
      view.set('delay', wait(30));
      expect(view.toHTML()).include('pending[true]');
      expect(view.toHTML()).include('result[]');
      expect(view.toHTML()).include('error[]');
    });

    it('sets fulfilled status', function () {
      var delay = wait(30, 'Okay');
      view.set('delay', delay);

      return delay.then(function () {
        expect(view.toHTML()).include('pending[]');
        expect(view.toHTML()).include('result[Okay]');
        expect(view.toHTML()).include('error[]');
      });
    });

    it('sets failed status', function () {
      var delay = waitFail(30, 'Uh oh');
      view.set('delay', delay);

      return delay.catch(function () {
        expect(view.toHTML()).include('pending[]');
        expect(view.toHTML()).include('result[]');
        expect(view.toHTML()).include('error[Uh oh]');
      });
    });
  });
});
