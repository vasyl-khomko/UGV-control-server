var http = require("http");

var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080
var serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

http.createServer(function (request, response) {

   // Send the HTTP header
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});

   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(serverPort, serverIpAddress);

// Console will print the message
console.log('Server running at ' + serverIpAddress + ":" + serverPort);
