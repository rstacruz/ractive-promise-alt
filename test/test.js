/* jshint expr: true */

var expect = require('chai').expect;
var Ractive = require('ractive');
var Promise = Ractive.Promise;

var isPromise, adapt, view, dealy;

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
      delay = wait(30, 'Okay');
      view.set('delay', delay);

      return delay.then(function () {
        expect(view.toHTML()).include('pending[]');
        expect(view.toHTML()).include('result[Okay]');
        expect(view.toHTML()).include('error[]');
      });
    });

    it('sets resolved to true', function () {
      delay = wait(30, 'Okay');
      view.set('delay', delay);

      return delay.then(function () {
        expect(view.get('delay.resolved')).eql(true);
      });
    });

    it('sets failed status', function () {
      delay = waitFail(30, 'Uh oh');
      view.set('delay', delay);

      return delay.catch(function () {
        expect(view.toHTML()).include('pending[]');
        expect(view.toHTML()).include('result[]');
        expect(view.toHTML()).include('error[Uh oh]');
      });
    });
  });

  /*
   * cancelling
   */

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

  /*
   * returning objects
   */

  describe('with promises that return objects', function () {
    beforeEach(function () {
      view = new Ractive({
        adapt: ['promise-alt'],
        template:
          "{{#delay}}" +
          "  {{#result}}Hello, {{first}} {{last}}{{/result}}" +
          "{{/delay}}"
      });
    });

    it('works', function () {
      delay = wait(30, { first: "Jon", last: "Snow" });
      view.set('delay', delay);

      return delay.then(function () {
        expect(view.toHTML()).include('Hello, Jon Snow');
      });
    });
  });

  /*
   * returning objects
   */

  describe('with promises that fail with errors', function () {
    beforeEach(function () {
      view = new Ractive({
        adapt: ['promise-alt'],
        template:
          "{{#delay}}" +
          "  {{#error}}Error: {{error.message}}{{/error}}" +
          "{{/delay}}"
      });
    });

    it('works', function () {
      delay = waitFail(30, new Error("Drats"));
      view.set('delay', delay);

      return delay.catch(function () {
        expect(view.toHTML()).include('Error: Drats');
      });
    });
  });

  /*
   * handle cases where promises are overridden.
   * when the first one resolves, it should be ignored.
   */

  describe('overriding old promises', function () {
    var long, short;

    beforeEach(function () {
      view = new Ractive({
        adapt: ['promise-alt'],
        template: "{{#delay}} result: {{result}} {{/delay}}"
      });

    });

    it('works', function () {
      long  = wait(80, "long");
      short = wait(25, "short");

      view.set('delay', long);

      wait(0).then(function () {
        view.set('delay', short);
      });

      return long.then(function () {
        expect(view.toHTML()).include('result: short');
      });
    });
  });

});
