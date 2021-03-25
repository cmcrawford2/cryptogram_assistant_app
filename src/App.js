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
    var inputString = event.target.value;
    this.setState({ encrypted: inputString });
    // Clear keys from previous quote.
    this.clearKeys();
  };

  clearKeys = () => {
    // Reset the key array to all empty strings.
    var emptyKeys = this.state.keyArray.map(() => "");
    this.setState({ keyArray: emptyKeys });
  };

  loadQuote = () => {
    // encryptedQuote() chooses a random quote from an array and encodes it
    // in a randomized substitution code of alphabet letters.
    var quote = encryptedQuote();
    this.setState({ encrypted: quote });
    // Make sure the key array is empty for the new quote.
    this.clearKeys();
    //this.renderSolution();
    // We also need to clear the input box in case there's a user entry in it.
    // If I can fix how this is done, we won't need this code.
    var textEntry = document.getElementById("UserInputBox");
    textEntry.value = "";
  };

  // The next set of functions are used to render the entire grid of the cryptogram.

  getKeyLetterIndex = (letter) => {
    // The index of the letter in the index array is just its index in A-Z.
    var uLetter = letter.toUpperCase(); // Should be but just to be safe.
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet.indexOf(uLetter);
  };

  getSolutionLetter = (letter) => {
    // If there is a solution letter for the input encoded letter, this returns it.
    // Otherwise it just returns the empty string.
    var keyArrayIndex = this.getKeyLetterIndex(letter);
    return this.state.keyArray[keyArrayIndex];
  };

  setSolutionLetter = (event) => {
    // A new solution letter has been typed above a coded letter.
    var solutionLetter = event.target.value;
    // The id of the target was set to the index of the letter in the original cryptogram.
    // So we know what the encoded letter is that corresponds to the user input.
    var index = event.target.id;
    var keyLetter = this.state.encrypted[index];
    // Get the index of the encoded letter in the key array - 1 to 26.
    var keyArrayIndex = this.getKeyLetterIndex(keyLetter);
    if (keyArrayIndex === -1) return; // Designed to not happen, but just in case...
    // Update a copy of the key array with the user decrypted letter.
    var copiedKeyArray = this.state.keyArray;
    copiedKeyArray[keyArrayIndex] = solutionLetter;
    // Update the key Array with the updated copy.
    this.setState({ keyArray: copiedKeyArray });
    // Refresh the grid. The solution letter appears above every keyLetter.
    this.renderSolution();
  };

  renderLetterEntry = (letter, index) => {
    // Set up the input box above each letter of the cryptogram.
    var solutionLetter = this.getSolutionLetter(letter);
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
    var uLetter = letter.toUpperCase();
    var top, bottom;
    if (uLetter < "A" || uLetter > "Z") {
      // Space or punctuation goes on top and just a space below.
      top = <div className="Punctuation">{uLetter}</div>;
      bottom = <div className="CodedLetter">&nbsp;</div>;
    } else {
      top = this.renderLetterEntry(letter, index);
      bottom = <div className="CodedLetter">{uLetter}</div>;
    }
    return (
      <div className="LetterSpace">
        {top}
        {bottom}
      </div>
    );
  };

  renderLetters = () => {
    // Unpack all the characters.
    var quoteAsLetters = this.state.encrypted.split("");
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
    // And the index must be the position of the letter in the entire string.
    var renderedChars = this.renderLetters();
    // Now that the letters are rendered, group them in words so that words do not break across lines.
    var phraseAsWords = this.state.encrypted.split(" ");
    var renderedWords = [];
    var startIndex = 0;
    for (var i = 0; i < phraseAsWords.length; i++) {
      var nThisWord = phraseAsWords[i].length;
      // convertedWord is an array of letter divs corresponding to any word, including punctuation.
      var convertedWord = renderedChars.slice(
        startIndex,
        startIndex + nThisWord
      );
      // Did I make a letter div for spaces that we're not using? Unclear.
      renderedWords.push(<div className="EncryptedWord">{convertedWord}</div>);
      // Include the removed space when advancing startIndex.
      startIndex += nThisWord + 1;
    }
    // Render the quote together with the input letter boxes as a list of words.
    return <div className="MainEncrypted">{renderedWords}</div>;
  };

  renderLetterCount = () => {
    // This function computes letter count for all letters.
    // I wonder whether it could be written more gracefully.
    // Also the layout is clunky.
    var encryptedUpperCase = this.state.encrypted.toUpperCase();
    var lc = []; // letterCountArray
    for (var i = 0; i < encryptedUpperCase.length; i++) {
      var letter = encryptedUpperCase[i];
      if (letter >= "A" && letter <= "Z") {
        lc.push(letter);
      }
    }
    lc.sort(); // Sort A to Z
    var lettersAndCounts = [];
    for (var i = 0; i < lc.length; i++) {
      var j = i;
      while (j < lc.length - 1 && lc[j] === lc[j + 1]) {
        j++; // count how many of this letter there are.
      }
      var letterCountString = lc[i] + ": " + (j - i + 1) + " ";
      lettersAndCounts.push(<div className="OneLC">{letterCountString}</div>);
      i = j;
    }
    return lettersAndCounts;
  };

  ResetButton = () => {
    // The user would like us to get rid of all solution letters.
    if (this.state.encrypted === "") return; // Not sure why I check.
    return (
      <button className="ResetButton" onClick={this.clearKeys}>
        Reset
      </button>
    );
  };

  // todo: style h1 and h2, and add a background.

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
        <p>{this.renderSolution()}</p>
        {this.ResetButton()}
        <div className="RowOfLC">{this.renderLetterCount()}</div>
      </div>
    );
  }
}

export default App;
