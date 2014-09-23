/*
 * based off lluchs/Ractive-adaptors-Promise
 */

;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['ractive'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('ractive'));
  } else {
    root.YourModule = factory(root.ractive);
  }

}(this, function (Ractive) {

  Ractive.adaptors.promise = {
    filter: isPromise,
    wrap: wrap
  };

  function isPromise (obj) {
    return obj && typeof obj.then === 'function';
  }

  function wrap (ractive, obj, keypath, prefixer) {
    var removed;
    var data = {};

    function update () {
      ractive.set(keypath, data);
    }

    data = { pending: true };
    update();

    obj.then(function (result) {
      if (!removed) {
        data = { result: result };
        update();
      }
    }, function (err) {
      if (!removed) {
        data = { error: err };
        update();
      }
    });

    return {
      get: function () { return data; },
      set: function () {},
      reset: function () { return false; },
      teardown: function () { removed = true; }
    };
  }

  function status (state) {
    return {
      pending:   (state === 'pending'),
      fulfilled: (state === 'fulfilled'),
      rejected:  (state === 'rejected')
    };
  }

}));
