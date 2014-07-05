'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DataSchema = new Schema({
  info: String,
  ck: String,
  ditch: String,
  host: String,
  ip: String,
  ref: String,
  sid: String,
  t: String,
  url: String,
  guid: String,
  title: String,
  done: Boolean
});

function put(Schema) {
  Schema.methods.put = function() {
    var self = this;
    var p = new Promise(function(resolve, reject) {
      self.save(function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    return p;
  };
}

put(DataSchema);

mongoose.model('data', DataSchema);

mongoose.connect('mongodb://localhost/yuzhou');
