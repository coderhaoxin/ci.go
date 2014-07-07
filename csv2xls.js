'use strict';

var config = require('./config'),
  fs = require('fs'),
  path = require('path'),
  csv = require('fast-csv'),
  json2xls = require('json2xls');

var filepath = path.resolve(__dirname, config.file);

var csv = require('fast-csv');

var origin = [];
var result = [];


csv
  .fromPath(filepath)
  .on('record', function(data) {
    if (data[0] === 'info' && data[1] === 'ck') {
      return;
    }
    result.push({
      info: data[0],
      ck: data[1],
      ditch: data[2],
      host: data[3],
      ip: data[4],
      ref: data[5],
      sid: data[6],
      t: data[7],
      url: data[8],
      guid: data[9],
      title: data[10]
    });
  })
  .on('end', function() {
    console.log('parse csv done');

    console.log(origin[1]);
    var xls = json2xls(result);

    fs.writeFileSync('data.xlsx', xls, 'binary');
  });