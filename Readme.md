# ractive-promise

```js
function getThings() {
  /* return a function here. */
}

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

based off lluchs/Ractive-adaptors-Promise.
