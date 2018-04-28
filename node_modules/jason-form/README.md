# jason-form

Simple node module for converting JSON objects to form data that is compatible with Rails' parameter naming conventions.

It accepts a JSON object and returns an array of key-value pairs.

## Examples

```javascript
var FormData = require('jason-form').FormData;

var json = {
 string: 'string',
 array: [1,2],
 object: {
  foo: 'foo',
  bar: 'bar'
  }
};
  
FormData.from(json) // [['string', 'string'], ['array[]', 1], ['array[]', 2], ['object[foo]', 'foo'] ['object[bar]', 'bar']]
```
