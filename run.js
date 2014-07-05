'use strict';

var config = require('./config'),
  path = require('path'),
  debug = require('debug')('parse:run'),
  co = require('co'),
  dom = require('jsdom'),
  csv = require('fast-csv'),
  fs = require('fs'),
  jschardet = require('jschardet'),
  iconv = require('iconv-lite');

var filepath = path.resolve(__dirname, config.file),
  extname = path.extname(config.file);
debug('filepath: %s, extname %s', filepath, extname);

var csv = require('fast-csv');

var origin = [];
var result = [];

function getTitleFromUrl(url) {
  return function(done) {
    dom.env(url, function(errors, window) {
      if (errors) {
        done(errors);
      } else {
        var title = '无标题';
        try {
          title = window.document.querySelector('title').text;
        } catch (e) {}

        done(null, title);
      }
    });
  };
}

csv
  .fromPath(filepath)
  .on('record', function(data) {
    origin.push(data);
  })
  .on('end', function() {
    console.log('done');

    co(function * () {
      var url, data;

      for (var i = 0; i < origin.length; i++) {
        data = origin[i];
        try {
          url = data[8].split('=')[1];
        } catch (e) {}
        console.log(url);

        var title = '无标题';

        try {
          title = yield getTitleFromUrl(url);
        } catch (e) {}

        data.push(title);

        result.push(data);
      }

      csv
        .writeToStream(fs.createWriteStream(config.dist), result, {
          headers: true
        }).on('finished', function() {
          console.info('finished');
        });
    })();
  });