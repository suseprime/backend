data = require('../data.js');

exports.type = 'chat-request';
exports.requiredParams = ['target-username'];
exports.signInRequired = true;
exports.callback = function (params, user) {
  var targetUsername = params['target-username'];
  if(data.usernames[targetUsername] != null) {
    var targetId = data.usernames[targetUsername];
    var chatId = Object.keys(data.chats).length + Object.keys(data.pendingChats).length;
    data.pendingChats[chatId] = {'from': user.id, 'to': targetId};
    data.sockets[targetId].sendMessage({'type':'chat-request', 'from-username':user.username, 'chat-id': chatId, 'request-id': params['request-id']});
  } else {
    user.sendError('User ' + targetUsername + ' not signed in.', params['request-id']);
  }
};
