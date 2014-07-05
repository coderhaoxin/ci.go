'use strict';

var config = require('./config'),
  path = require('path'),
  debug = require('debug')('parse:run'),
  co = require('co'),
  dom = require('jsdom'),
  csv = require('fast-csv'),
  xls2json = require('./lib/xls2json'),
  xlsx2json = require('./lib/xlsx2json');

var filepath = path.resolve(__dirname, config.file),
  extname = path.extname(config.file);
debug('filepath: %s, extname %s', filepath, extname);

// co(function * () {
//   var jsonPath, jsonData;

//   if (extname === '.xls') {
//     jsonPath = yield xls2json(filepath);
//   } else if (extname === '.xlsx') {
//     jsonPath = yield xlsx2json(filepath);
//   } else {
//     console.warn('unknown file');
//   }

//   console.info('parse', extname, 'success');

//   jsonData = require(jsonPath);

//   console.log(jsonData.length)

//   debug('parsed data: ', jsonData.length);
// })();

var csv = require('fast-csv');

var result = [];

csv
  .fromPath(filepath)
  .on('record', function(data) {
    // var url;
    // try {
    //   url = data[8].split('=')[1];
    // } catch (e) {}
    // console.log(url);

    dom.env(
      url,
      function(errors, window) {
        if (errors) {
          console.log(errors);
        }
      }
    );
  })
  .on('end', function() {
    console.log('done');
  });