'use strict';

var config = require('./config'),
  path = require('path'),
  debug = require('debug')('parse:run'),
  co = require('co'),
  gather = require('co-gather'),
  dom = require('jsdom'),
  csv = require('fast-csv');

var filepath = path.resolve(__dirname, config.file),
  extname = path.extname(config.file);
debug('filepath: %s, extname %s', filepath, extname);

var csv = require('fast-csv');

var origin = [];
var result = [];

function getTitleFromUrl(url) {
  return function(done) {
    var t = setTimeout(function() {
      var e = new Error('timeout');
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
      var url01, url02, url03, url04, url05, data01, data02, data03, data04, data05;

      for (var i = 0; i < origin.length; i += 5) {
        data01 = origin[i];
        data02 = origin[i + 1];
        data03 = origin[i + 2];
        data04 = origin[i + 3];
        data05 = origin[i + 4];

        try {
          url01 = data01[8].split('=')[1];
          url02 = data02[8].split('=')[1];
          url03 = data03[8].split('=')[1];
          url04 = data04[8].split('=')[1];
          url05 = data05[8].split('=')[1];
        } catch (e) {
          debug('error:', e);
        }

        var titles,
          title01 = '无标题',
          title02 = '无标题',
          title03 = '无标题',
          title04 = '无标题',
          title05 = '无标题';

        // console.log(url01, url02, url03, url04, url05);

        try {
          var thunks = [
            getTitleFromUrl(url01),
            getTitleFromUrl(url02),
            getTitleFromUrl(url03),
            getTitleFromUrl(url04),
            getTitleFromUrl(url05),
          ];

          titles = yield gather(thunks);

          title01 = titles[0].value || '无标题';
          title02 = titles[1].value || '无标题';
          title03 = titles[2].value || '无标题';
          title04 = titles[3].value || '无标题';
          title05 = titles[4].value || '无标题';
        } catch (e) {
          debug('error:', e);
        }

        data01.push(title01);
        data02.push(title02);
        data03.push(title03);
        data04.push(title04);
        data05.push(title05);

        result.push(data01);
        result.push(data02);
        result.push(data03);
        result.push(data04);
        result.push(data05);

        console.log(i);

        if ((i >= 5000) && (i % 5000) === 0) {
          yield write(result, i);

          console.log(i, 'done');

          result = [];
        }
      }
    })();
  });