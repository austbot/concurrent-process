'use strict';

function countVowels(word) {

  let wordArr = word.split('');
  let vowelArr = 'aeiouy'.split('');
  return wordArr
    .reduce(function (carry, letter) {
      return vowelArr.indexOf(letter) !== -1 ? carry + 1 : carry;
    }, 0);
};

process.on('message', function (data) {
  setTimeout(function () {
    process.send(countVowels(data));
    process.exit();
  }, 100); //Just to prove its async :)
});