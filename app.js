const http = require('http');
const os = require('os');

const handler = function(request, response) {
  console.log("Received request from " + request.connection.remoteAddress);
  response.writeHead(200);
  response.end("Hello World! Hostname: " + os.hostname() + "\n");
};

var www = http.createServer(handler);
www.listen(8080);
console.log("Server is listening on port 8080");
