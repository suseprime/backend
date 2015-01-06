var config = require('./config.js');
var data = require('./data.js');
var methods = require('./methods');
var User = require('./user.js')

var WebSocketServer = require('ws').Server;
var WebSocket = require('./node_modules/ws/lib/WebSocket.js');
var wss = new WebSocketServer({port: config.port});

WebSocket.prototype.sendMessage = function (message) {
  this.send(JSON.stringify(message));
};

console.log('Server started. Listening at %s:%s/%s', wss.options.host, wss.options.port, wss.options.path == null ? "" : wss.options.path);

wss.on('error', function (e) {
  console.log(e);
});

wss.on('connection', function connection(ws) {
  // TODO: Use User class
  var user = new User(ws);
  if(config.isDevelop())
    console.log('%d connected', user.id);
  ws.on('message', function incoming(message) {
    try {
      var encmsg = JSON.parse(message);
      if(config.isDevelop())
        console.log('received: "%s" from %d', message, user.id);
      var method = methods.getMethod(encmsg.type);
      if(method == null) {
        user.sendError('Method of type ' + encmsg,type + ' not found.');
        return;
      }
      if(method.hasOwnProperty('signInRequired')) {
        if(user.signedIn !== method.signInRequired) {
          user.sendError('Try to process ' + method.type + (user.signedIn ? '' : ' not') + ' signed in.');
          return;
        }
      }

      for(var i = 0; i < method.requiredParams.length; i++) {
        if(!encmsg.hasOwnProperty(method.requiredParams[i])) {
          // Missing argument
          user.sendError('Missing argument ' + method.requiredParams[i] + '.');
          return;
        }
      }

      method.callback(encmsg, user);
    } catch (e) {
      console.log(e.stack);
    }
  });

  ws.on('close', function() {
    if(config.isDevelop())
      console.log('Connection #%d closed', user.id);
    user.delete();
  });
});
