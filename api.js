var config = require('./config.js');
var methods = require('./methods');

var Api = {};

Api.perform = function (message, user) {
  try {
    var encmsg = JSON.parse(message);
    if(config.isDevelop())
      console.log('received: "%s" from %d', message, user.id);
    var method = methods.getMethod(encmsg.type);
    if(method == null) {
      user.sendError('Method of type ' + encmsg,type + ' not found.', encmsg['request-id']);
      return;
    }
    if(method.hasOwnProperty('signInRequired')) {
      if(user.signedIn !== method.signInRequired) {
        user.sendError('Try to process ' + method.type + (user.signedIn ? '' : ' not') + ' signed in.', encmsg['request-id']);
        return;
      }
    }

    for(var i = 0; i < method.requiredParams.length; i++) {
      if(!encmsg.hasOwnProperty(method.requiredParams[i])) {
        // Missing argument
        user.sendError('Missing argument ' + method.requiredParams[i] + '.', encmsg['request-id']);
        return;
      }
    }

    method.callback(encmsg, user);
  } catch (e) {
    console.log(e.stack);
  }
};

module.exports = Api;
