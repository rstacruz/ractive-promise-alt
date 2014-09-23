# ractive-promise

Adaptor for Ractive that allows you to watch for a promise's status.

```js
/* here's a function that returns a promise. */
function getUser() {
  return $.get('/api/user');
}

r = new Ractive({
  adapt: ['promise']
});

r.set('user', getUser());
```

You can inspect for the status like so:

```html
<div>
  {{#pending}}
    Loading...
  {{/pending}}

  {{#result}}
    Your name is: {{first}} {{last}}
  {{/result}]

  {{#error}}
    An error occured: {{.}}
  {{/error}}
</div>
```

### Credits

Based off [lluchs/Ractive-adaptors-Promise](https://github.com/lluchs/Ractive-adaptors-Promise).
