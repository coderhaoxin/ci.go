'use strict';

var config = require('./config'),
  path = require('path'),
  debug = require('debug')('parse:run'),
  co = require('co'),
  urllib = require('co-urllib'),
  jschardet = require('jschardet'),
  iconv = require('iconv-lite'),
  $ = require('jparser');

var filepath = path.resolve(__dirname, config.file),
  extname = path.extname(config.file);
debug('filepath: %s, extname %s', filepath, extname);

function * getTitleFromUrl(url) {
  var res = yield urllib.request(url);

  var code = jschardet.detect(res.data).encoding;
  var text;

  console.log(code);

  if (code === 'GB2312') {
    text = iconv.decode(res.data, 'gbk');
  } else {
    text = res.data.toString();
  }

  var root = $(text);
  var title = root.find('title').text() || '无标题';

  return title;
}

var mongoose = require('mongoose');
require('./to-db');
var Data = mongoose.model('data');

function * getTitle(url) {
  var title = '无标题';

  try {
    title = yield getTitleFromUrl(url);
  } catch (e) {
    console.error(e);
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