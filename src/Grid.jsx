import PropTypes from "prop-types";
import Letter from "./Letter";

export default function Grid({
  encrypted,
  setSolutionLetter,
  getSolutionLetter,
}) {
  // If there's nothing to render, just return.
  if (encrypted === "") {
    return;
  }
  // Render the letters first.
  // Rendered letters include a guess input box above each A-Z,
  // And the index must be the position of the coded letter in the original string.

  const renderedChars = encrypted
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

  // Now that the letters are rendered, group them in words so that words do not break across lines.
  let startIndex = 0;
  const renderedWords = encrypted.split(" ").map((word, index) => {
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

  return <div className="MainEncrypted">{renderedWords}</div>;
}

Grid.propTypes = {
  encrypted: PropTypes.string,
  setSolutionLetter: PropTypes.func,
  getSolutionLetter: PropTypes.func,
};
