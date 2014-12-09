data = require('../data.js');

exports.type = 'chat-request-accepted';
exports.requiredParams = ['chat-id'];
exports.signInRequired = true;
exports.callback = function (params, user) {
  var pendingChat = data.pendingChats[params['chat-id']];
  if(pendingChat == null) {
    // TODO: Accepting not-existing pending chat
  }
  var chatId = params['chat-id'];
  data.chats[chatId] = {'from':pendingChat['from'], 'to':pendingChat['to']};
  console.log(pendingChat);
  data.sockets[pendingChat.from].sendMessage({'type':'chat-established', 'chat-id': params['chat-id'], 'target-username': user.username});
};
