# jason-form

[![npm](https://img.shields.io/npm/dm/jason-form.svg)]()
[![Build Status](https://travis-ci.org/greena13/jason-form.svg)](https://travis-ci.org/greena13/jason-form)
[![GitHub license](https://img.shields.io/github/license/greena13/jason-form.svg)](https://github.com/greena13/jason-form/blob/master/LICENSE)


Utility for converting arbitrarily deep JavaScript objects to FromData, using Rails conventions for nested arrays and objects.

If you use Rails views to generate and submit forms already, you do not need this library.

If you use some other method for generating your front end data, or have it as a JavaScript of JSON object, then this library can be considered the glue code needed to plug in to a Rails backend.

## Usage

```javascript
import jasonForm from 'jason-form';

const input = {
 string: 'string',
 array: [1,2],
 object: {
  foo: 'foo',
  bar: 'bar'
  }
};

const body = jasonForm.formData(input) // [['string', 'string'], ['array[]', 1], ['array[]', 2], ['object[foo]', 'foo'] ['object[bar]', 'bar']]

fetch('http://my.rails.server', {
  method: 'POST',
  credentials: 'include',
  body,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

### Why not just submit the JavaScript object as a JSON request?

In most cases, this will work just fine and should indeed be the preferred approach. The issue is when you need to transmit data that is not supported by the JSON format (such as file upload data), or the backend that you need to send data to only accepts form data. Then this library becomes helpful.

### What if my JavaScript object isn't already in a rails-friendly format (_attributes suffixes, snake_cased keys, etc)?

Run it through [rails_request](https://github.com/greena13/rails-request) first.
