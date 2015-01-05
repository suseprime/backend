data = require('../data.js');

exports.type = 'sign-in';
exports.requiredParams = ['username'];
exports.signInRequired = false;
exports.callback = function (params, user) {
  if(data.usernames.hasOwnProperty(params.username)) {
    user.sendMessage({'type': 'error', 'message': 'Username already signed in.'});
  } else if(data.reservedNicks.hasOwnProperty(params.username)) {
    if(!params.hasOwnProperty('password')) {
      user.sendMessage({'type': 'error', 'message': 'Nick reserved. Password needed for log in.'});
      return;
    } else {
      if(params.password === data.reservedNicks[params.username]) {
        user.signIn(params.username);
        delete data.reservedNicks[params.username];
      } else {
        user.sendMessage({'type': 'error', 'message': 'Wrong log-in password.'});
        return;
      }
    }
  } else {
    user.signIn(params.username)
  }
};
