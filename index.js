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

    function update (values) {
      data = values;
      ractive.set(keypath, values);
    }

    update({ pending: true });

    obj.then(function (result) {
      if (removed) return;
      update({ result: result });
    }, function (err) {
      if (removed) return;
      update({ error: err });
    });

    return {
      get: function () { return data; },
      set: function () {},
      reset: function () { return false; },
      teardown: function () { removed = true; }
    };
  }

}));
