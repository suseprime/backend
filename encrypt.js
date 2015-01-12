DSA = require('otr').DSA;
OTR = require('otr').OTR;

exports.options = {
  fragment_size: 65536,
  send_interval: 200
};

exports.init = function () {
  this.options.priv = new DSA();
};

exports.createOtr = function () {
  var user = new OTR(this.options);
  user.REQUIRE_ENCRYPTION = true;/*
  user.on('ui', function (msg) {
    // TODO: msg - a api call to perform
  });
  user.on('io', function (msg, meta) {
    // TODO: msg - message to send
  });*/
  user.on('error', function (err, severity) {
    if (severity === 'error')  // either 'error' or 'warn'
      console.error("error occurred: " + err)
  });
  return user;
};
