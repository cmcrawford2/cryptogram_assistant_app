import React from "react";
import initialData from "./InitialData.js";
import encryptedQuote from "./encryptedQuote.js";
import "./styles.css";

class App extends React.Component {
  // Initialize the state with a blank string for the encrypted quote
  // and an array of 26 blank strings for the decoded letters.
  // state = { encrypted: "", keyArray: { KeyData } };
  state = initialData;

  // updateMessage is called when the user enters their own cryptogram.
  updateMessage = (event) => {
    const inputString = event.target.value;
    this.setState({ encrypted: inputString });
    // Clear keys from previous quote.
    this.clearKeys();
  };

  clearKeys = () => {
    // Reset the key array to all empty strings.
    const emptyKeys = this.state.keyArray.map(() => "");
    this.setState({ keyArray: emptyKeys });
  };

  loadQuote = () => {
    // encryptedQuote() chooses a random quote from an array and encodes it
    // in a randomized substitution code of alphabet letters.
    const quote = encryptedQuote();
    this.setState({ encrypted: quote });
    // Make sure the key array is empty for the new quote.
    this.clearKeys();
    //this.renderSolution();
    // We also need to clear the input box in case there's a user entry in it.
    // If I can fix how this is done, we won't need this code.
    const textEntry = document.getElementById("UserInputBox");
    textEntry.value = "";
  };

  // The next set of functions are used to render the entire grid of the cryptogram.

  getKeyLetterIndex = (letter) => {
    // The index of the letter in the index array is just its index in A-Z.
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet.indexOf(letter.toUpperCase());
  };

  getSolutionLetter = (letter) => {
    // If there is a solution letter for the input encoded letter, this returns it.
    // Otherwise it just returns the empty string.
    const keyArrayIndex = this.getKeyLetterIndex(letter);
    return this.state.keyArray[keyArrayIndex];
  };

  setSolutionLetter = (event) => {
    // A new solution letter has been typed above a coded letter.
    const solutionLetter = event.target.value;
    // The id of the target was set to the index of the letter in the original cryptogram.
    // So we know what the encoded letter is that corresponds to the user input.
    const keyLetter = this.state.encrypted[event.target.id];
    // Get the index of the encoded letter in the key array - 1 to 26.
    const keyArrayIndex = this.getKeyLetterIndex(keyLetter);
    if (keyArrayIndex === -1) return; // Designed to not happen, but just in case...
    // Update a copy of the key array with the user decrypted letter.
    const copiedKeyArray = this.state.keyArray;
    copiedKeyArray[keyArrayIndex] = solutionLetter;
    // Update the key Array with the updated copy.
    this.setState({ keyArray: copiedKeyArray });
    // Refresh the grid. The solution letter appears above every keyLetter.
    this.renderSolution();
  };

  renderLetterEntry = (letter, index) => {
    // Set up the input box above each letter of the cryptogram.
    const solutionLetter = this.getSolutionLetter(letter);
    // "solutionLetter" will be an empty string if the letter is not decrypted yet.
    return (
      <input
        className="LetterEntry"
        type="text"
        maxLength="1"
        id={index}
        value={solutionLetter}
        placeholder={solutionLetter}
        onChange={this.setSolutionLetter}
      />
    );
  };

  convertChar = (letter, index) => {
    // Return a div that has a space on top and the encrypted letter below.
    // The index is a unique identifier for the input box above the letter.
    const uLetter = letter.toUpperCase();
    const notLetter = uLetter < "A" || uLetter > "Z";
    // We're making a little column of two things: if it's not a letter,
    // the top is the character and the bottom is just blank.
    // If it's a letter, the top is a space for the guess
    // and the bottom is the uppercase letter.
    return (
      <div className="LetterSpace" key={index}>
        {notLetter ? (
          <div className="Punctuation">{uLetter}</div>
        ) : (
          this.renderLetterEntry(letter, index)
        )}
        {notLetter ? (
          <div className="CodedLetter">&nbsp;</div>
        ) : (
          <div className="CodedLetter">{uLetter}</div>
        )}
      </div>
    );
  };

  renderLetters = () => {
    // Unpack all the characters.
    const quoteAsLetters = this.state.encrypted.split("");
    // Make a div for each char that has an input box on top if the char is a letter.
    return quoteAsLetters.map(this.convertChar);
  };

  renderSolution = () => {
    // If there's nothing to render, just return.
    if (this.state.encrypted === "") {
      return;
    }
    // Render all the letters at once!!!!
    // This is required to give input letter boxes an id that points back to the coded letter.
    // Rendered letters include a guess input box above each A-Z,
    // And the index must be the position of the coded letter in the original string.
    const renderedChars = this.renderLetters();
    // Now that the letters are rendered, group them in words so that words do not break across lines.
    const phraseAsWords = this.state.encrypted.split(" ");
    let startIndex = 0;
    const renderedWords = phraseAsWords.map((word, index) => {
      const nThisWord = word.length;
      const renderedWord = renderedChars.slice(
        startIndex,
        startIndex + nThisWord
      );
      // Include the removed space when advancing startIndex.
      startIndex += nThisWord + 1;
      return (
        <div className="EncryptedWord" key={index}>
          {renderedWord}
        </div>
      );
    });
    // Render the quote together with the input letter boxes as a list of words.
    return <div className="MainEncrypted">{renderedWords}</div>;
  };

  showUsedLetters = () => {
    const keyArray = this.state.keyArray;
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
  };

  renderLetterCount = () => {
    // This function computes letter count for all letters.
    const encrypted = this.state.encrypted
      .toUpperCase()
      .split("")
      .filter((letter) => letter >= "A" && letter <= "Z");
    const uniqueLetters = encrypted.filter(
      (letter, index) => index === encrypted.indexOf(letter)
    );
    // Create an array of unique letters and total of those letters in the encrypted text.
    const lettersAndCounts = uniqueLetters.map((uniqueLetter) => [
      uniqueLetter,
      encrypted.filter((letter) => letter === uniqueLetter).length,
    ]);
    lettersAndCounts.sort((a, b) => b[1] - a[1]);
    const letterCountDivs = lettersAndCounts.map((lc, index) => {
      return <div className="OneLC" key={index}>{`${lc[0]}: ${lc[1]} `}</div>;
    });
    return letterCountDivs;
  };

  toggleLetterFrequency = () => {
    // Toggle whether we show letter frequencies or not.
    this.setState({ showLetterFrequency: 1 - this.state.showLetterFrequency });
  };

  render() {
    return (
      <div className="App">
        <h1>Personal Cryptogram Assistant</h1>
        <h2>I will make it easy for you to solve a cryptogram!</h2>
        <input
          className="UserCryptogram"
          type="text"
          id="UserInputBox" /* Need this to clear input if quote is selected. */
          placeholder=" Enter your cryptogram here..."
          /* value={this.state.encrypted} */
          onChange={this.updateMessage}
        />
        <h2>Or try one from my vault!</h2>
        <button className="QuoteButton" onClick={this.loadQuote}>
          Quote
        </button>
        <div className="Solution">{this.renderSolution()}</div>
        <footer>
          {this.state.encrypted !== "" && this.showUsedLetters()}
          {this.state.encrypted !== "" && (
            <button className="ResetButton" onClick={this.clearKeys}>
              Reset
            </button>
          )}
          {this.state.encrypted !== "" &&
            this.state.showLetterFrequency === 1 && (
              <div className="RowOfLC">{this.renderLetterCount()}</div>
            )}
          {this.state.encrypted !== "" && (
            <button
              className="ShowFrequencyButton"
              onClick={this.toggleLetterFrequency}
            >
              {
                this.state.letterFrequencyButtonText[
                  this.state.showLetterFrequency
                ]
              }
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
}

export default App;
