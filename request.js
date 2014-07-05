'use strict';

var config = require('./config'),
  path = require('path'),
  debug = require('debug')('parse:run'),
  co = require('co'),
  dom = require('jsdom');

var filepath = path.resolve(__dirname, config.file),
  extname = path.extname(config.file);
debug('filepath: %s, extname %s', filepath, extname);

function getTitleFromUrl(url) {
  return function(done) {
    // console.log('start:', url);

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

        // console.log('get:', url);

        done(null, title);
      }
    });
  };
}

var mongoose = require('mongoose');
require('./to-db');
var Data = mongoose.model('data');


function * getTitle(url) {
  var title = '无标题';

  try {
    title = yield getTitleFromUrl(url);
  } catch (e) {
    debug('error:', e);
  }

  return title;
}

setTimeout(function() {

  co(function * () {
    for (var i = 0; true; i++) {
      var datas = yield Data.find({
        done: false
      }).skip(i).limit(1).exec();

      var data = datas[0];

      if (!data) {
        break;
      }

      data.title = yield getTitle(data.url);
      data.title = data.title.replace(/\n/g, '');
      data.done = true;

      yield data.put();

      console.log(i, data.title);
    }
  })();

}, 3000);