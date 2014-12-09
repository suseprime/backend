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
    console.log(data.pendingChats[chatId]);
    console.log('Chat request form %s #%d to %s #%d (valid target)', user.username, data.usernames[user.username], targetUsername, targetId);
    data.sockets[targetId].sendMessage({'type':'chat-request', 'from-username':user.username, 'chat-id': chatId});
  } else {
    console.log('Chat request from %s to %s (not existing target)', user.username, targetUsername);
    user.sendMessage({'type':'error', 'message':'Not signed in username'});
  }
};
