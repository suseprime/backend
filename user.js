data = require('./data.js');

function User (ws) {
  this.ws = ws;
  this.id = data.sockets.push(this) - 1;
  this.username = null;
  this.signedIn = false;
}

User.prototype.sendMessage = function (message) {
  this.ws.send(JSON.stringify(message));
};


User.prototype.delete = function () {
  if(this.signedIn) {
    for(var id in data.chats) {
      var chat = data.chats[id];
      if(chat.from == this.id) {
        data.sockets[chat.to].sendMessage({'type':'chat-closed', 'chat-id':id});
        delete data.chats[id];
      } else if (chat.to === this.id) {
        data.sockets[chat.from].sendMessage({'type':'chat-closed', 'chat-id':id});
        delete data.chats[id];
      }
    }
    delete data.usernames[this.username];
  }
  data.sockets.splice(this.id);
};

module.exports = User;
