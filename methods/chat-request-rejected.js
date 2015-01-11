config = require('../config.js')
data = require('../data.js');

exports.type = 'chat-request-rejected';
exports.requiredParams = ['chat-id'];
exports.signInRequired = true;
exports.callback = function (params, user) {
  var pendingChat = data.pendingChats[params['chat-id']];
  if(pendingChat == null) {
    user.sendError('Rejecting non-existing chat', params['request-id']);
    return;
  }
  if(pendingChat['to'] !== user.id) {
    user.sendError('Bad try to reject chat.', params['request-id']);
    return;
  }
  var chatId = params['chat-id'];
  delete data.pendingChats[params['chat-id']];
  if(config.isDevelop()) console.log(pendingChat);
  data.sockets[pendingChat.from].sendMessage({'type':'chat-rejected', 'chat-id': chatId, 'target-username': user.username});
  user.sendMessage({'type': 'chat-request-rejected-successed', 'chat-id': chatId, 'request-id': params['request-id']})
  };
