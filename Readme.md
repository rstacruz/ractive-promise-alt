# ractive-promise-alt

Adaptor for [Ractive] that allows you to watch for a [Promise]'s result and status.

*Find more Ractive.js plugins at [docs.ractivejs.org/latest/plugins](http://docs.ractivejs.org/latest/plugins)*

[![Status](http://img.shields.io/travis/rstacruz/ractive-promise-alt/master.svg?style=flat)](https://travis-ci.org/rstacruz/ractive-promise-alt "See test builds")

```js
/* here's a function that returns a promise. */
function getUser() {
  return $.get('/api/user');
}

r = new Ractive({
  adapt: ['promise-alt']
});

/* you'll then be able to consume the promise via ractive.set. */
r.set('user', getUser());
```

In your template, you'll be able to inspect the promise's result (on success) or
error message (on reject). You'll also be able to figure out the status of the promise.

```html
<div>
  {{#user}}
    {{#pending}}
      Loading...
    {{/pending}}

    {{#result}}
      Hello, {{first}} {{last}}!
    {{/result}}

    {{#error}}
      An error occured: {{.}}
    {{/error}}
  {{/user}}
</div>
```

### API

This adaptor sets the following keys:

 * __`pending`__<br>
 will be `true` if the promise is still being processed. It
 will be `undefined` as soon as the promise resolves/rejects.

 * __`result`__<br>
 will be the result of a resolved (successful) promise. It
 will be `undefined` when pending or in the case of an error.

 * __`resolved`__<br>
 will be `true` when the progress resolves and a `result` is available.

 * __`error`__<br>
 will be the result of a rejected (failing) promise. It will be
 `undefined` when pending or if the promise resolves.

 * __`progress`__<br>
 if the promise emits a progress update, the progress is reported
 here. This is only available when a Promise is still pending.

### Differences

This is an alternate adaptor to [Ractive-adaptors-Promise]. ractive-promise-alt
provides a few more features:

 * Status reporting
 * Progress events
 * Errors are treated differently from results

### Usage

ractive-promise-alt is available via npm.

    $ npm install --save ractive-promise-alt

[![npm version](http://img.shields.io/npm/v/ractive-promise-alt.svg?style=flat)](https://npmjs.org/package/ractive-promise-alt "View this project on npm")

__CommonJS usage:__ Require the module to use it. It automatically registers
itself into either *window.Ractive* or *require('ractive')*, whichever's
available. No need to use the return value.

```js
require('ractive-promise-alt');
```

__Standalone usage:__ For those not using npm, it's also available as a
[standalone .js file](index.js). Be sure to include it after
[ractive.js][Ractive].

### Credits

Based off [lluchs]/[Ractive-adaptors-Promise].

[lluchs]: https://github.com/lluchs
[Ractive-adaptors-Promise]: https://github.com/lluchs/Ractive-adaptors-Promise
[Ractive]: http://ractivejs.org/
[Promise]: http://promisesaplus.com/

### Thanks

**ractive-promise-alt** © 2014+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/ractive-promise-alt/contributors
