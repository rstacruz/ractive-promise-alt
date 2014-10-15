;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['ractive'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('ractive'));
  } else {
    factory(root.Ractive);
  }

}(this, function (Ractive) {

  Ractive.adaptors['promise-alt'] = {
    filter: isPromise,
    wrap: wrap
  };

  function isPromise (obj) {
    return obj && typeof obj.then === 'function';
  }

  function wrap (ractive, obj, keypath, prefixer) {
    var data = {};

    function update (values) {
      data = values;
      ractive.set(prefixer(values));
    }

    // set initial state
    ractive.set(keypath, {});
    update({ pending: true });

    // listen to promise events
    obj.then(function (result) {
      update({ pending: void 0, progress: void 0, resolved: true, result: result });
    }, function (err) {
      update({ pending: void 0, progress: void 0, error: err });
    }, function (prog) {
      update({ pending: true,   progress: prog });
    });

    // give Ractive a .get handler
    return {
      get: function () { return data; },
      set: function () {},
      reset: function () { return false; },
      teardown: function () {}
    };
  }

}));
