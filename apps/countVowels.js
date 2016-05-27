'use strict';
/**
 * Count the vowels in a word
 * @param word
 * @returns {*}
 */
function countVowels(word) {

  let wordArr = word.split('');
  let vowelArr = 'aeiouy'.split('');
  return wordArr
    .reduce(function (carry, letter) {
      return vowelArr.indexOf(letter) !== -1 ? carry + 1 : carry;
    }, 0);
}
/**
 * When we get the input, run the function then die.
 */
process.on('message', function (data) {
  setTimeout(function () {
    process.send(countVowels(data));
    process.exit();
  }, 100); //Just to prove its async :)
});