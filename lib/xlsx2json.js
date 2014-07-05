'use strict';

var xlsx = require('xlsx-to-json');

module.exports = function(input) {
  var output = input.replace(/.xlsx$/, '.json');

  return function(done) {
    xlsx({
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