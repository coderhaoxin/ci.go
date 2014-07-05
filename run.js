'use strict';

var cp = require('child_process'),
  path = require('path'),
  execfile = path.resolve(__dirname, 'worker.js');

var total = 65000,
  interval = 200;

var i = 0;

var start = Date.now();

setInterval(function() {
  console.log('已进行: %n / %n', i, total);
  var due = (Date.now() - start) / (60 * 1000);
  console.log('耗时: %n min', due);
  console.log('还需: %n min', due / i * (total - i));
}, 10000);

for (i = 0; i < total; i += interval) {
  cp.spawnSync('node', ['--harmony', execfile, i, interval]);
  console.log(i);
}