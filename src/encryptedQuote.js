import quotes from "./quotes.js";

var encryptedQuote = () => {
  var randomIndex = Math.floor(Math.random() * quotes.length);
  // console.log(randomIndex);
  var quote = quotes[randomIndex];

  // Get a randomized alphabet
  var codeKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var codeKeyArray = codeKeys.split("");
  // This is a classic algorithm for randomizing an array.
  for (var i = 25; i > 0; i--) {
    var j = Math.floor(Math.random() * i);
    var temp = codeKeyArray[i];
    codeKeyArray[i] = codeKeyArray[j];
    codeKeyArray[j] = temp;
  }
  // console.log(codeKeyArray);

  // Now put the quote into code, leaving non-letters as they are.
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var encrypted = "";
  for (var k = 0; k < quote.length; k++) {
    var uLetter = quote[k].toUpperCase();
    var codeIndex = alphabet.indexOf(uLetter);
    if (codeIndex === -1) {
      encrypted = encrypted + uLetter;
    } else {
      encrypted = encrypted + codeKeyArray[codeIndex];
    }
  }
  return encrypted;
};

export default encryptedQuote;
