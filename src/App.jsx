import { useState, useEffect } from "react";
// import initialKeyArray from "./initialData.js";
import encryptedQuote from "./encryptedQuote.js";
import Grid from "./Grid";
import Letter from "./Letter";
import LetterCount from "./LetterCount";
import "./styles.css";

export function App() {
  // Initialize the state with a blank string for the encrypted quote
  // and an array of 26 blank strings for the decoded letters.
  const [encrypted, setEncrypted] = useState("");
  const [keyArray, setKeyArray] = useState(Array(26).fill(""));
  const [showLetterFrequency, setShowLetterFrequency] = useState(false);

  useEffect(() => {
    // When the keyArray changes, we need to regenerate the letters in the grid.
    // This is the only way I have figured out to do this.
    encrypted
      .split("")
      .map((letter, index) => (
        <Letter
          letter={letter}
          index={index}
          setSolutionLetter={setSolutionLetter}
          getSolutionLetter={getSolutionLetter}
          key={index}
        />
      ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyArray]);

  // updateMessage is called when the user enters their own cryptogram.
  function updateMessage(event) {
    const inputString = event.target.value;
    setEncrypted(inputString);
    // Clear keys from previous quote.
    setKeyArray(Array(26).fill(""));
  }

  function loadQuote() {
    // encryptedQuote() chooses a random quote from an array and encodes it
    // in a randomized substitution code of alphabet letters.
    const quote = encryptedQuote();
    setEncrypted(quote);
    // Make sure the key array is empty for the new quote.
    setKeyArray(Array(26).fill(""));
    // We also need to clear the input box in case there's a user entry in it.
    const textEntry = document.getElementById("UserInputBox");
    textEntry.value = "";
  }

  function getKeyLetterIndex(letter) {
    // The index of the letter in the index array is just its index in A-Z.
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet.indexOf(letter.toUpperCase());
  }

  function getSolutionLetter(letter) {
    // If there is a solution letter for the input encoded letter, this returns it.
    // Otherwise it just returns the empty string.
    const keyArrayIndex = getKeyLetterIndex(letter);
    return keyArray[keyArrayIndex];
  }

  function setSolutionLetter(event) {
    // A new solution letter has been typed above a coded letter.
    const solutionLetter = event.target.value;
    // The id of the target was set to the index of the letter in the original cryptogram.
    // So we know what the encoded letter is that corresponds to the user input.
    const encodedLetter = encrypted[event.target.id];
    // Get the index of the encoded letter in the key array - 1 to 26.
    const keyArrayIndex = getKeyLetterIndex(encodedLetter);
    if (keyArrayIndex === -1) return; // Designed to not happen, but just in case...
    // Update a copy of the key array with the user decrypted letter.
    const copiedKeyArray = [...keyArray];
    copiedKeyArray[keyArrayIndex] = solutionLetter;
    // Update the key Array with the updated copy.
    setKeyArray(copiedKeyArray);
  }

  function showUsedLetters() {
    const usedLetters = keyArray
      .filter((letter) => letter !== "")
      .map((letter) => letter.toUpperCase());
    if (usedLetters.length === 0) return;
    usedLetters.sort((a, b) => a.localeCompare(b));
    return (
      <div className="RowOfLC">
        <div className="OneLC">Letters used: {usedLetters.join(" ")}</div>
      </div>
    );
  }

  function toggleLetterFrequency() {
    // Toggle whether we show letter frequencies or not.
    setShowLetterFrequency(!showLetterFrequency);
  }

  return (
    <div className="App">
      <h1>Personal Cryptogram Assistant</h1>
      <h2>I will make it easy for you to solve a cryptogram!</h2>
      <input
        className="UserCryptogram"
        type="text"
        id="UserInputBox" /* Need this to clear input if quote is selected. */
        placeholder=" Enter your cryptogram here..."
        onChange={updateMessage}
      />
      <h2>Or try one from my vault!</h2>
      <button className="QuoteButton" onClick={loadQuote}>
        Quote
      </button>
      <div className="Solution">
        <Grid
          encrypted={encrypted}
          setSolutionLetter={setSolutionLetter}
          getSolutionLetter={getSolutionLetter}
        />
      </div>
      <footer>
        {encrypted !== "" && showUsedLetters()}
        {encrypted !== "" && (
          <button
            className="ResetButton"
            onClick={() => setKeyArray(Array(26).fill(""))}
          >
            Reset
          </button>
        )}
        {encrypted !== "" && showLetterFrequency && (
          <div className="RowOfLC">
            <LetterCount encrypted={encrypted} />
          </div>
        )}
        {encrypted !== "" && (
          <button
            className="ShowFrequencyButton"
            onClick={toggleLetterFrequency}
          >
            {showLetterFrequency
              ? "Hide Letter Frequency"
              : "Show Letter Frequency"}
          </button>
        )}
        <h3>Created by Cris Crawford 2021-2023</h3>
        <a href="https://www.vecteezy.com/free-vector/vector">
          Background by funkyboy2014 at Vecteezy
        </a>
      </footer>
    </div>
  );
}

export default App;
