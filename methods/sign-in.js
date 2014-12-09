data = require('../data.js');

exports.type = 'sign-in';
exports.requiredParams = ['username'];
exports.signInRequired = false;
exports.callback = function (params, user) {
  if(data.usernames.hasOwnProperty(params.username)) {
    user.sendMessage({'type': 'error', 'message': 'Username already signed in.'});
  } else {
    data.usernames[params.username] = user.id;
    user.signedIn = true;
    user.username = params.username;
    console.log('User %s signed in', params.username);
    user.sendMessage({'type': 'sign-in-accepted'});
  }
};
