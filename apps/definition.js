'use strict';
var promise = require('es6-promise');
var http = require('http');

function getDefinition(word) {
  
};

process.on('message', function (data) {
  setTimeout(function () {
    process.send(countVowels(data));
    process.exit();
  }, 1000)
});