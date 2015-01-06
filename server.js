var config = require('./config.js');
var encrypt = require('./encrypt.js');
var User = require('./user.js')

var WebSocketServer = require('ws').Server;
var WebSocket = require('./node_modules/ws/lib/WebSocket.js');
var wss = new WebSocketServer({port: config.port});

console.log('Server started. Listening at %s:%s/%s', wss.options.host, wss.options.port, wss.options.path == null ? "" : wss.options.path);

wss.on('error', function (e) {
  console.log(e);
});

wss.on('connection', function connection(ws) {
  var user = new User(ws);
  if(config.isDevelop())
    console.log('%d connected', user.id);
  ws.on('message', function incoming(message) {
    user.otr.receiveMsg(message);
  });

  ws.on('close', function() {
    if(config.isDevelop())
      console.log('Connection #%d closed', user.id);
    user.delete();
  });
});

encrypt.init();
