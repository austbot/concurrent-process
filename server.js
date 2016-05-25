'use strict';
const Hapi = require('hapi');
const server = new Hapi.Server();
const http = require('http');
const Stream = require('stream');
server.connection({ port: 3000 , host: '127.0.0.1'});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    let stream = new Stream.PassThrough();
    setInterval(function () {
      http.get("http://randomword.setgetgo.com/get.php", function (res) {
        res.setEncoding('utf8');
        res.on('data', function(word){
          stream.write(JSON.stringify({message: word}));
        });
      });
    }, 500);
    reply(stream);
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  process.send({message: "Ready"});
});