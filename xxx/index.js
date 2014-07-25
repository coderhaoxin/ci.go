'use strict';

var serve = require('koa-static');
var koa = require('koa');
var app = koa();

app.use(function * (next) {
  yield * next;
  // this.set('Access-Control-Allow-Origin', '*');
});

app.use(serve('.'));

app.listen(3000);

console.log('listening on port 3000');
