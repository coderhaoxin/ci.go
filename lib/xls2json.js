'use strict';

var xls = require('xls-to-json');

module.exports = function(input) {
  var output = input.replace(/.xls$/, '.json');

  return function(done) {
    xls({
      input: input,
      output: output
    }, function(err) {
      if (err) {
        done(err);
      } else {
        done(null, output);
      }
    });
  };
};