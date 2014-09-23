/* jshint expr: true */

var expect = require('chai').expect;
var Ractive = require('ractive');
var Promise = Ractive.Promise;

var isPromise, adapt;

describe('ractive-promise', function () {
  before(function () {
    require('../index');
    adapt = Ractive.adaptors['promise-alt'];
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

  it('registers itself', function () {
    expect(adapt).be.an('object');
    expect(adapt.wrap).be.a('function');
    expect(adapt.filter).be.a('function');
  });

  describe('filter', function () {
    before(function () {
      isPromise = adapt.filter;
    });

    it('works for true promises', function () {
      var promise = wait(100);
      expect(isPromise(promise)).be.true;
    });

    it('works for non-promises', function () {
      expect(isPromise(1)).be.false;
    });
  });

  describe('with promises', function () {
    var view, delay;

    beforeEach(function () {
      view = new Ractive({
        adapt: ['promise-alt'],
        template:
          "{{#delay}}" +
          "  pending[{{#pending}}true{{/pending}}] " +
          "  result[{{result}}] " +
          "  error[{{error}}] " +
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

  describe('cancelling promises', function () {
    var view, delay;

    beforeEach(function () {
      view = new Ractive({
        adapt: ['promise-alt'],
        template:
          "{{#show}}" +
          "  {{#delay}}" +
          "    pending[{{#pending}}true{{/pending}}] " +
          "    result[{{result}}] " +
          "    error[{{error}}] " +
          "  {{/delay}}" +
          "{{/show}}"
      });
    });

    it('sets pending', function () {
      view.set('show', true);
      view.set('delay', wait(30));
      expect(view.toHTML()).include('pending[true]');
      view.teardown();
      return wait(60).then(function () {
        /* just make sure no errors happen. */
      });
    });
  });
});
