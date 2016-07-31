var http = require("http");
var fs = require("fs");
var assert = require('assert');

var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080
var serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var command = "";

http.createServer(function (request, response) {
   console.log("request.url: " + request.url);

   if(request.url == "/set-command") {
     var data = '';
     request.on('data', function(chunk) {
       data += chunk;
     });
     request.on('end', function() {
       command = JSON.parse(data).command;
       console.log(command);
     });

     response.writeHead(200, {'Content-Type': 'text/plain'});
     response.end("OK");

   } else if (request.url == "/get-command") {
     response.writeHead(200, {'Content-Type': 'text/plain'});
     response.end(command);
     //command = "";

   } else {
      fs.readFile("index.html", function(err, data){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
   }
}).listen(serverPort, serverIpAddress);

// Console will print the message
console.log('Server running at ' + serverIpAddress + ":" + serverPort);
