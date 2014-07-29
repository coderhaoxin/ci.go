'use strict';

var config = require('./config'),
  path = require('path'),
  debug = require('debug')('parse:run'),
  co = require('co'),
  dom = require('jsdom'),
  csv = require('fast-csv');

var filepath = path.resolve(__dirname, config.file),
  extname = path.extname(config.file);
debug('filepath: %s, extname %s', filepath, extname);

var csv = require('fast-csv');

var origin = [];
var result = [];

var mongoose = require('mongoose');
require('./to-db');
var Data = mongoose.model('data');

setTimeout(function() {

  csv
    .fromPath(filepath)
    .on('record', function(data) {
      origin.push(data);
    })
    .on('end', function() {
      console.log('parse csv done');

      co(function * () {
        for (var i = 0; i < origin.length; i++) {
          var d = {};
          try {
            d.info = origin[i][0];
            d.ck = origin[i][1].split('=')[1];
            d.ditch = origin[i][2].split('=')[1];
            d.host = origin[i][3].split('=')[1];
            d.ip = origin[i][4].split('=')[1];
            d.ref = origin[i][5].split('=')[1];
            d.sid = origin[i][6].split('=')[1];
            d.t = origin[i][7].split('=')[1];
            d.url = origin[i][8].split('=')[1];
            d.guid = origin[i][9].split('=')[1];
            d.done = false;
          } catch (e) {
            console.error(e);
            continue;
          }

          d.url = d.url || null;
          if (!d.url.startsWith('http://')) {
            console.log(d.url);
            continue;
          }

          var dd = new Data(d);
          yield dd.put();
          console.log(i);
        }

        mongoose.disconnect();
      })();
    });
}, 3000);
