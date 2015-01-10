data = require('../data.js');

exports.type = 'sign-in';
exports.requiredParams = ['username'];
exports.signInRequired = false;
exports.callback = function (params, user) {
  if(data.usernames.hasOwnProperty(params.username)) {
    user.sendError('Username already signed in.', params['request-id']);
  } else if(data.reservedNicks.hasOwnProperty(params.username)) {
    if(!params.hasOwnProperty('password')) {
      user.sendError('Nick reserved. Password needed for log in.', params['request-id']);
      return;
    } else {
      if(params.password === data.reservedNicks[params.username]) {
        user.signIn(params.username);
        delete data.reservedNicks[params.username];
      } else {
        user.sendError('Wrong log-in password.', params['request-id']);
        return;
      }
    }
  } else {
    user.signIn(params.username, params['request-id'])
  }
};
