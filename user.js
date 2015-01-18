var data = require('./data.js');
var config = require('./config.js');
var encrypt = require('./encrypt.js');
var api = require('./api.js');


function User (ws) {
  this.ws = ws;
  this.id = data.sockets.push(this) - 1;
  this.username = null;
  this.signedIn = false;

  this.otr = encrypt.createOtr();

  var user = this;
  this.otr.on('ui', function (msg, encrypted) {
    api.perform(msg, user);
  });

  this.otr.on('io', function (msg, meta) {
    user.ws.send(msg);
  });

  this.otr.sendQueryMsg();
}

User.prototype.sendMessage = function (message) {
  this.otr.sendMsg(JSON.stringify(message));
};

User.prototype.sendError = function (msg, reqId) {
  this.sendMessage({
    'type': 'error',
    'message': msg,
    'request-id': reqId
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

    for(var id in data.pendingChats) {
      var chat = data.pendingChats[id];
      if(chat.from == this.id) {
        data.sockets[chat.to].sendMessage({'type':'chat-closed', 'chat-id':id});
        delete data.pendingChats[id];
      } else if (chat.to === this.id) {
        data.sockets[chat.from].sendMessage({'type':'chat-closed', 'chat-id':id});
        delete data.pendingChats[id];
      }
    }

    delete data.usernames[this.username];
  }
  data.sockets.splice(this.id);
  this.username = null;
  this.signedIn = false;
};

User.prototype.signIn = function (username, reqId) {
  data.usernames[username] = this.id;
  this.signedIn = true;
  this.username = username;
  if(config.isDevelop())
    console.log('User %s signed in', username);
  this.sendMessage({'type': 'sign-in-accepted', 'request-id': reqId});
};

module.exports = User;
