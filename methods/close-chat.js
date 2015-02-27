data = require('../data.js');

exports.type = 'close-chat';
exports.requiredParams = ['chat-id'];
exports.signInRequired = true;
exports.callback = function (params, user) {
  var chat = data.chats[params['chat-id']];
  var id = params['chat-id'];
  if(chat.from == this.id) {
    data.sockets[chat.to].sendMessage({'type':'chat-closed', 'chat-id':id});
  } else if (chat.to === this.id) {
    data.sockets[chat.from].sendMessage({'type':'chat-closed', 'chat-id':id});
  }

  delete data.chats[id];

  user.sendMessage({'type': 'close-chat-success', 'request-id': params['request-id']});
};
