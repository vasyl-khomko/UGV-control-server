var http = require("http");
var WebSocketServer = require('websocket').server;
var fs = require("fs");
var assert = require('assert');

var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080
var serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var commands = [{"type":1,"value":0},{"type":3,"value":7}];

var socketCoonection = null;


var server = http.createServer(function (request, response) {
   console.log("request.url: " + request.url);

   if(request.url == "/set-command") {
     var data = '';
     request.on('data', function(chunk) {
       data += chunk;
     });
     request.on('end', function() {
       var command = JSON.parse(data);
       if(command.type == 1 || command.type == 2) {
         commands[0] = command;
       } else if(command.type == 3 || command.type == 4) {
         commands[1] = command;
       }

       if(socketCoonection) {
         socketCoonection.sendUTF(JSON.stringify(commands));
       }

       console.log(command);
     });

     response.writeHead(200, {'Content-Type': 'text/plain'});
     response.end("OK");

   } else if (request.url == "/get-commands") {
     response.writeHead(200, {'Content-Type': 'text/plain'});
     response.end(JSON.stringify(commands));
     //command = "";

   } else {
      fs.readFile("index.html", function(err, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
   }
}).listen(serverPort, serverIpAddress);

// Console will print the message
console.log('Server running at ' + serverIpAddress + ":" + serverPort);

// create the server
var wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    console.log('on request');
    var connection = request.accept(null, request.origin);
    socketCoonection = connection;

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        console.log('on message');
        if (message.type === 'utf8') {
            console.log("Message data:" + message.utf8Data);
            connection.sendUTF(JSON.stringify( { type: 'history', data: 'hgfhgfhgf'} ));
        }
    });

    connection.on('close', function(connection) {
        console.log('on close');
    });
});
