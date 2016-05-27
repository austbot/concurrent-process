'use strict';
var promise = require('es6-promise');
var https = require('https');
var R = require('ramda');
const firstMeaning = R.lensPath(['tuc','0','meanings','0','text']);
/**
 * Grab the definition of a word from the interwebs
 * @param word
 * @returns {*}
 */
function getDefinition(word) {
  return new promise.Promise((resolve, reject)=> {
    let responseData = '';
    https.get(`https://glosbe.com/gapi/translate?phrase=${word}&from=en&dest=en&format=json`, (res) => {
        res.setEncoding('utf8');

        res.on('data', (data) => {
          responseData += data;
        });

        res.on('end', () => {
          let object = JSON.parse(responseData);
          let meaning = R.view(firstMeaning, object);
          if (meaning) {

            resolve(meaning);
          } else {
            reject();
          }
        });
      })
      .on('error', () => {
        reject();
      });
  });
}
/**
 * When we get the input, run the function then die.
 */
process.on('message', function (data) {
  getDefinition(data)
    .then(function (definition) {
      process.send({definition});
      process.exit();
    })
    .catch(function () {
      process.send({error: "Error getting Definition"});
      process.exit();
    });
});