'use strict';

var config = require('./config'),
  path = require('path'),
  debug = require('debug')('parse:run'),
  co = require('co'),
  dom = require('jsdom'),
  csv = require('fast-csv');

var skip = process.argv[2] | 0,
  limit = process.argv[3] | 0;

var filepath = path.resolve(__dirname, config.file),
  extname = path.extname(config.file);
debug('filepath: %s, extname %s', filepath, extname);

var csv = require('fast-csv');

var origin = [];
var result = [];

function getTitleFromUrl(url) {
  return function(done) {
    console.log('start:', url);

    var t = setTimeout(function() {
      var e = new Error('timeout');

      console.log('timeout 3000');

      done(e);
    }, 3000);

    dom.env(url, function(errors, window) {
      if (errors) {
        done(errors);
      } else {
        var title = '无标题';
        try {
          title = window.document.querySelector('title').text;
        } catch (e) {
          debug('error:', e);
        }

        clearTimeout(t);

        console.log('get:', url);

        done(null, title);
      }
    });
  };
}

function write(data, i) {
  return function(done) {
    var dist = config.dist,
      csvpath = dist.replace(/.csv$/, '-' + i + '.csv');

    csv
      .writeToPath(csvpath, data, {
        headers: true
      })
      .on('finish', function() {
        done();
      });
  };
}

csv
  .fromPath(filepath)
  .on('record', function(data) {
    origin.push(data);
  })
  .on('end', function() {
    console.log('parse csv done');

    co(function * () {
      yield getTitles();
      yield writeToCsv();
    })();
  });


function * getTitles() {
  for (var i = 0; i < limit; i += 5) {     console.log(i)
    yield [
      getTitle(skip + i),
      getTitle(skip + i + 1),
      getTitle(skip + i + 2),
      getTitle(skip + i + 3),
      getTitle(skip + i + 4)
    ];
  }
}

function * getTitle(i) {
  var url, data;
  data = origin[i];

  try {
    url = data[8].split('=')[1];
  } catch (e) {
    debug('error:', e);
  }

  var title = '无标题';

  try {
    title = yield getTitleFromUrl(url);
  } catch (e) {
    debug('error:', e);
  }

  data.push(title.replace(/\n/g, ''));
  result.push(data);

  console.log(i);
}

function * writeToCsv() {
  yield write(result, skip);
}