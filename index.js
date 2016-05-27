'use strict';
/**
 * Concurrent Node.js Experiement
 * @author https://github.com/austbot
 */
const http = require('http');
const cp = require("child_process");

/**
 * Helper method to create a Pure Microservice
 * @param appPath: string
 * @param output: fn
 */
function runApp(appPath, output) {
  //Create the process
  let proc = cp.fork(appPath);
  //Log the process pid
  console.log(`New Process started: ${proc.pid}`);
  //Setup the callback (output function)
  proc.on('message', output);
  //Log the exit|death 
  proc.on('exit', function () {
    console.log(`Process with pid ${proc.pid} has ended`);
  });
  //Return the process object for more fun
  return proc;
}
/**
 * This is our http streaming api process.
 */
let server = cp.fork('server.js');
//Make sure to setup the death event
process.on('exit', () => {
  //Dont lock the port if there is an error
  server.kill();
  console.log('Shutting Down...')
});

//Make sure our http server is ready.
server.on('message', function (msg) {
  //Options duh!
  let options = {
    hostname: '127.0.0.1',
    method: 'GET',
    port: 3000
  };
  //Make the request
  let req = http.get(options, (res) => {
    //Set message encoding.
    res.setEncoding('utf8');
    //On chunk of data from word server
    res.on('data', (chunk) => {
      let word = JSON.parse(chunk).message;
      //Log That we recieved a word
      console.log(`Word Received: ${word}\n\n`);
      /**
       * ************************* THESE ARE THE PURE SERVICES HERE
       */
      //Make a new vowel process that disposes once the work is done. Log Out put of async function.
      let vowel = runApp('apps/countVowels.js', (count) => console.log(`Vowel Count for ${word} ${count}\n\n`));
      vowel.send(word);

      //Make a new definition process that disposes once the work is done.
      let def = runApp('apps/definition.js', ({error, definition}) => {
        if(error){
          console.log(`Could not get definition of ${word}\n\n`);
        }else{
          console.log(`Definition of ${word} ${definition}\n\n`);
        }
      });
      def.send(word);
      /**
       * *********************************************************
       */
    });
    //If the server ever ends the connection
    res.on('end', () => {
      console.log('No more data in response.')
    });
  });
  setTimeout(function(){
    req.abort();
  }, 5000);
  //If the server Errors out
  req.on('error', (error) => {
    console.log(error);
  });
  req.end();
});



