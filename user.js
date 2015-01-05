data = require('./data.js');
config = require('./config.js');

function User (ws) {
  this.ws = ws;
  this.id = data.sockets.push(this) - 1;
  this.username = null;
  this.signedIn = false;
}

User.prototype.sendMessage = function (message) {
  this.ws.send(JSON.stringify(message));
};

User.prototype.sendError = function (msg) {
  this.sendMessage({
    'type': 'error',
    'message': msg
  });
};

User.prototype.delete = function () {
  if(this.signedIn) {
    if(config.isDevelop())
      console.log('signing out %s', this.username);

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
  this.username = null;
  this.signedIn = false;
};

User.prototype.signIn = function (username) {
  data.usernames[username] = this.id;
  this.signedIn = true;
  this.username = username;
  if(config.isDevelop())
    console.log('User %s signed in', username);
  this.sendMessage({'type': 'sign-in-accepted'});
};

module.exports = User;
