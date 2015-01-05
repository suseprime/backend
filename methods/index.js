config = require('../config.js');
fs = require('fs');

var methods = {};
exports.scan = function () {
  var methodFiles = fs.readdirSync('./methods');
  for(var i = 0; i < methodFiles.length; i++) {
    var filename = methodFiles[i];
    if(filename === 'index.js') {
      continue;
    }
    var method = require('./' + filename);
    if(!method.hasOwnProperty('type')) {
      if(config.isDevelop())
        console.log(filename + ' - type prop does not exists, skipping');
      continue;
    }
    methods[method.type] = method;
  }
};

exports.scan();

exports.getMethod = function (name) {
  return methods[name];
}
