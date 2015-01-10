data = require('../data.js');

exports.type = 'sign-out';
exports.requiredParams = [];
exports.signInRequired = true;
exports.callback = function (params, user) {
  if(params.hasOwnProperty('password')) {
    data.reservedNicks[user.username] = params['password'];
  }
  user.sendMessage({'type': 'signed-out', 'request-id': params['request-id']});
  user.delete();
};
