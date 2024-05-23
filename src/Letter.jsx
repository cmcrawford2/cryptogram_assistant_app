import PropTypes from "prop-types";

export default function Letter({
  letter,
  index,
  getSolutionLetter,
  setSolutionLetter,
}) {
  // Return a div that has a space on top and the encrypted letter below.
  // The index is a unique identifier for the input box above the letter,
  // WHICH HAS TO MATCH THE INDEX OF THE CHARACTER IN THE ENCRYPTED STRING.
  // We're making a little column of two things: if it's not a letter,
  // the top is the character and the bottom is just blank.
  // If it's a letter, the top is a space for the guess
  // and the bottom is the uppercase letter.
  // "solutionLetter" will be an empty string if the letter is not decrypted yet.

  const uLetter = letter.toUpperCase();
  const notLetter = uLetter < "A" || uLetter > "Z";
  const solutionLetter = getSolutionLetter(letter);

  return (
    <div className="LetterSpace" key={index}>
      {notLetter ? (
        <div className="Punctuation">{uLetter}</div>
      ) : (
        <input
          className="LetterEntry"
          type="text"
          maxLength="1"
          id={index}
          value={solutionLetter}
          onChange={setSolutionLetter}
        />
      )}
      {notLetter ? (
        <div className="CodedLetter">&nbsp;</div>
      ) : (
        <div className="CodedLetter">{uLetter}</div>
      )}
    </div>
  );
}

Letter.propTypes = {
  letter: PropTypes.string,
  index: PropTypes.number,
  setSolutionLetter: PropTypes.func,
  getSolutionLetter: PropTypes.func,
};
