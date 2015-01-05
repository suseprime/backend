data = require('../data.js');

exports.type = 'message';
exports.requiredParams = ['chat-id', 'message', 'message-id'];
exports.signInRequired = true;
exports.callback = function (params, user) {
  if(data.chats[params['chat-id']] == null) {
    user.sendError('Chat not requested.');
    return;
  }
  var chat = data.chats[params['chat-id']];
  if(chat.from == user.id) {
    var toId = chat.to;
  } else {
    var toId = chat.from;
  }

  data.sockets[toId].sendMessage({'type':'message', 'message': params.message, 'message-id': params['message-id'], 'chat-id': params['chat-id']});
  user.sendMessage({'type':'message-sent', 'message-id': params['message-id']});
};
