data = require('../data.js');

exports.type = 'status';
exports.requiredParams = [];
exports.callback = function (params, user) {
  var out = {
    'type': 'status',
    'signedIn': user.signedIn,
    'username': user.username
  };
  user.sendMessage(out);
};
