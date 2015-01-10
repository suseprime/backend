config = require('../config.js')
data = require('../data.js');

exports.type = 'chat-request-accepted';
exports.requiredParams = ['chat-id'];
exports.signInRequired = true;
exports.callback = function (params, user) {
  var pendingChat = data.pendingChats[params['chat-id']];
  if(pendingChat == null) {
    user.sendError('Accepting non-existing chat', params['request-id']);
    return;
  }
  if(pendingChat['to'] !== user.id) {
    user.sendError('Bad try to accept chat.', params['request-id']);
    return;
  }
  var chatId = params['chat-id'];
  data.chats[chatId] = {'from':pendingChat['from'], 'to':pendingChat['to']};
  if(config.isDevelop())
    console.log(pendingChat);
  data.sockets[pendingChat.from].sendMessage({'type':'chat-established', 'chat-id': params['chat-id'], 'target-username': user.username, 'request-id': params['request-id']});
};
