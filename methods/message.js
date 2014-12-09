data = require('../data.js');

exports.type = 'message';
exports.requiredParams = ['chat-id', 'message', 'message-id'];
exports.signInRequired = true;
exports.callback = function (params, user) {
  // TODO: Convert to user
  if(data.chats[params['chat-id']] == null) {
    console.log("Chat not requested.");
    return;
  }
  var chat = data.chats[params['chat-id']];
  if(chat.from == user.id) {
    var toId = chat.to;
  } else {
    var toId = chat.from;
  }

  console.log(toId);
  data.sockets[toId].sendMessage({'type':'message', 'message': params.message, 'message-id': params['message-id'], 'chat-id': params['chat-id']});
  user.sendMessage({'type':'message-sent', 'message-id': params['message-id']});
};
