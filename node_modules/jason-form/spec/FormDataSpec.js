"use strict";

var FormData = require('../index').FormData;

describe("FormData.from", function(){
  it("does not change keys for simple data type values", function(){
    var simpleDataTypes = {
      string: 'string',
      integer: 1,
      float: 1.0,
      null: null,
      undefined: undefined
    };

    for(var dataType in simpleDataTypes){
      var jsonObject = {};
      jsonObject[dataType] = simpleDataTypes[dataType];

      expect(FormData.from(jsonObject)).toEqual([[dataType, simpleDataTypes[dataType]]]);
    }

  });

  it('it postfixes [] to keys for array values', function(){
    var jsonObject = {};
    var arrayKey = 'array';

    jsonObject[arrayKey] = [1,2,3];

    var arrayKeyWithSuffix = arrayKey+'[]';

    var expected = [
      [arrayKeyWithSuffix, 1],
      [arrayKeyWithSuffix, 2],
      [arrayKeyWithSuffix, 3]
    ];

    expect(FormData.from(jsonObject)).toEqual(expected);
  });

  it('it correctly encodes an empty array []', function(){
    var jsonObject = {};
    var arrayKey = 'array';

    jsonObject[arrayKey] = [];

    var arrayKeyWithSuffix = arrayKey+'[]';

    var expected = [
      [arrayKeyWithSuffix, null]
    ];

    expect(FormData.from(jsonObject)).toEqual(expected);
  });

  it('it postfixes [][key] to keys for arrays of objects', function(){
    var jsonObject = {};
    var arrayKey = 'array';

    jsonObject[arrayKey] = [
      {
        one: 'one',
        two: 'two'
      },
      {
        one: 'three',
        two: 'four'
      }
    ];

    function objectKeyWithSuffix(key){
      return arrayKey + '[][' + key + ']'
    }

    var expected = [
      [objectKeyWithSuffix('one'), 'one'],
      [objectKeyWithSuffix('two'), 'two'],
      [objectKeyWithSuffix('one'), 'three'],
      [objectKeyWithSuffix('two'), 'four']
    ];

    expect(FormData.from(jsonObject)).toEqual(expected);
  });

  it('it postfixes [key] to keys for object values', function(){
    var jsonObject = {};
    var objectName = 'object';

    function objectKeyWithSuffix(key){
      return objectName + '[' + key + ']'
    }

    jsonObject[objectName] = {
      one: 'one',
      two: 'two',
      three: 'three'
    };

    var expected = [
      [objectKeyWithSuffix('one'), 'one'],
      [objectKeyWithSuffix('two'), 'two'],
      [objectKeyWithSuffix('three'), 'three']
    ];

    expect(FormData.from(jsonObject)).toEqual(expected);
  });

  it('it postfixes [key1][key2] to keys for objects containing objects', function(){
    var jsonObject = {};
    var objectName = 'object';

    function objectKeyWithSuffix(key1, key2){
      return objectName + '[' + key1 + '][' + key2 + ']';
    }

    jsonObject[objectName] = {
      one: {
        oneA: 'one',
        oneB: 'two'
      },
      two: {
        oneA: 'three',
        oneB: 'four'
      }
    };

    var expected = [
      [objectKeyWithSuffix('one', 'oneA'), 'one'],
      [objectKeyWithSuffix('one', 'oneB'), 'two'],
      [objectKeyWithSuffix('two', 'oneA'), 'three'],
      [objectKeyWithSuffix('two', 'oneB'), 'four']
    ];

    expect(FormData.from(jsonObject)).toEqual(expected);
  });


});
