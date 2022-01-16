import quotes from "./quotes.js";

const encryptedQuote = () => {
  // Return a random encrypted quote as a string.
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  // Permute the alphabet
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const codeKeyArray = alphabet.split("");
  // This is a classic algorithm for permuting an array such that no element remains the same.
  for (let i = 25; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [codeKeyArray[i], codeKeyArray[j]] = [codeKeyArray[j], codeKeyArray[i]];
  }
  // Now put the quote into code, leaving non-letters as they are.
  const encrypted = quote.split("").map(letter => {
    const index = alphabet.indexOf(letter.toUpperCase());
    return index === -1 ? letter : codeKeyArray[index];
  }).join("");
  return encrypted;
};

export default encryptedQuote;