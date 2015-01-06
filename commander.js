var WebSocket = require('ws');
var DSA = require('otr').DSA;
var OTR = require('otr').OTR;

var myKey = new DSA();

var options = {
  fragment_size: 140
  , send_interval: 200
  , priv: myKey
}

var server = new OTR(options);

server.on('ui', function (msg, encrypted) {
  console.log("message to display to the user: " + msg)
  // encrypted === true, if the received msg was encrypted
})

server.on('io', function (msg, meta) {
  socket.send(msg);
})

server.on('error', function (err, severity) {
  if (severity === 'error')  // either 'error' or 'warn'
    console.error("error occurred: " + err)
})

function completer(line) {
  var completions = 'connect signin chat-request help accept-chat-request message signout status'.split(' ');
  var hits = completions.filter(function(c) { return c.indexOf(line) == 0 })
  // show all completions if none found
  return [hits.length ? hits : completions, line]
}

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout, completer);
var socket;

rl.setPrompt('commander> ');
rl.prompt(true);

rl.on('line', function(line) {
  var command = line.trim().split(" ");
  switch(command[0]) {
    case 'help':
      console.log('comming soon!');
      break;

    case 'connect':
      var host =
        'ws://' +
        ((typeof command[1] !== 'undefined') ? command[1] : 'localhost') +
        ':' +
        ((typeof command[2] !== 'undefined') ? command [2] : '8080')
      ;
      console.log('Connecting to %s', host);
      socket = new WebSocket(host);
      socket.on('open', function () {
        console.log('connected');
      });
      socket.on('message', function (data) {
        server.receiveMsg(data);
        // console.log('Got: '+data);
      });
      socket.on('close', function () {
        console.log('Connection closed.');
        process.exit(0);
      });
      break;

    case 'signin':
      var msg = {'type': 'sign-in', 'username' : command[1]};
      if(command[2]) {
        msg['password'] = command[2];
      }
      server.sendMsg(JSON.stringify(msg));
      break;

    case 'chat-request':
      var msg = JSON.stringify({'type': 'chat-request', 'target-username' : command[1]});
      server.sendMsg(msg);
      break;

    case 'accept-chat-request':
      var msg = JSON.stringify({'type': 'chat-request-accepted', 'chat-id' : command[1]});
      server.sendMsg(msg);
      break;

    case 'message':
      var msg = JSON.stringify({'type': 'message', 'chat-id' : command[1], 'message-id': command[2], 'message': command[3]});
      server.sendMsg(msg);
      break;

    case 'signout':
      var msg = JSON.stringify({'type': 'sign-out', 'password' : command[1]});
      server.sendMsg(msg);
      break;

    case 'status':
      var msg = JSON.stringify({'type': 'status'});
      server.sendMsg(msg);
      break;

    default:
      break;
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0)
;});
