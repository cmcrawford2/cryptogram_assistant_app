import quotes from "./quotes.js";

const encryptedQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  // console.log(randomIndex);
  const quote = quotes[randomIndex];

  // Get a randomized alphabet
  const codeKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const codeKeyArray = codeKeys.split("");
  // This is a classic algorithm for randomizing an array.
  for (let i = 25; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = codeKeyArray[i];
    codeKeyArray[i] = codeKeyArray[j];
    codeKeyArray[j] = temp;
  }
  // Now put the quote into code, leaving non-letters as they are.
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const encrypted = quote.split("").map(letter => {
    const index = alphabet.indexOf(letter.toUpperCase());
    return index === -1 ? letter : codeKeyArray[index];
  }).join("");
  return encrypted;
};

export default encryptedQuote;
