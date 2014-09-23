;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['ractive'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('ractive'));
  } else {
    root.YourModule = factory(root.ractive);
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

    ractive.set(keypath, {});
    update({ pending: true });

    obj.then(function (result) {
      update({ pending: false, progress: false, result: result });
    }, function (err) {
      update({ pending: false, progress: false, error: err });
    }, function (prog) {
      update({ pending: true, progress: prog });
    });

    return {
      get: function () { return data; },
      set: function () {},
      reset: function () { return false; },
      teardown: function () {}
    };
  }

}));
