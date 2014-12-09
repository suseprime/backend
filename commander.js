var crypto = require('crypto');
var WebSocket = require('ws');

function completer(line) {
  var completions = 'connect signin chat-request help accept-chat-request message'.split(' ');
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
      socket = new WebSocket('ws://localhost:8080');
      socket.on('open', function () {
        console.log('connected');
      });
      socket.on('message', function (data) {
        console.log('Got: '+data);
      });
      socket.on('close', function () {
        console.log('Connection closed.');
        process.exit(0)
      });
      break;

    case 'signin':
      var msg = JSON.stringify({'type': 'sign-in', 'username' : command[1]});
      socket.send(msg);
      break;

    case 'chat-request':
      var msg = JSON.stringify({'type': 'chat-request', 'target-username' : command[1]});
      socket.send(msg);
      break;

    case 'accept-chat-request':
      var msg = JSON.stringify({'type': 'chat-request-accepted', 'chat-id' : command[1]});
      socket.send(msg);
      break;

    case 'message':
      var msg = JSON.stringify({'type': 'message', 'chat-id' : command[1], 'message-id': command[2], 'message': command[3]});
      socket.send(msg);
      break;

    default:
      break;
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0)
;});
