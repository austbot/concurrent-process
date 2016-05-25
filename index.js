'use strict';

const http = require('http');
const cp = require("child_process");

function runApp(appPath, output) {
  let proc = cp.fork(appPath);
  proc.on('message', output);
  return proc;
};

let server = cp.fork('server.js');


process.on('exit', () => {
  //Dont lock the port if there is an error
  server.kill();
  console.log('Shutting Down...')
});

//Make sure our http server is ready.
server.on('message', function (msg) {

  let options = {
    hostname: '127.0.0.1',
    method: 'GET',
    port: 3000
  };

  let req = http.get(options, (res) => {
    //Set message encoding.
    res.setEncoding('utf8');
    //On chunk of data from word server
    res.on('data', (chunk) => {
      let word = JSON.parse(chunk).message;
      //Log That we recieved a word
      console.log(`Word Received: ${word}`);
      //Run sub apps
      //Make a new vowel process that disposes once the work is done. Log Out put of async function.
      let vowel = runApp('apps/countVowels.js', (count) => console.log(`Vowel Count for ${word} ${count}`));
      vowel.send(word);
      //Make a new definition process that disposes once the work is done.
      let def = runApp('apps/definition.js', ({error, definition}) => {
        if(error){
          console.log(`Could not get definition of ${word}`);
        }else{
          console.log(`Definition of ${word} ${definition}`);
        }
      });
      def.send(word);
    });
    //If the server ever ends the connection
    res.on('end', () => {
      console.log('No more data in response.')
    });
  });
  //If the server Errors out
  req.on('error', (error) => {
    console.log(error);
  });
  req.end();
});



