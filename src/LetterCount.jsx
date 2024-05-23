import PropTypes from "prop-types";

export default function LetterCount({ encrypted }) {
  // This function computes letter count for all letters.
  const letters = encrypted
    .toUpperCase()
    .split("")
    .filter((letter) => letter >= "A" && letter <= "Z");

  const uniqueLetters = letters.filter(
    (letter, index) => index === letters.indexOf(letter)
  );

  // Create an array of unique letters and total of those letters in the encrypted text.
  const lettersAndCounts = uniqueLetters.map((uniqueLetter) => [
    uniqueLetter,
    letters.filter((letter) => letter === uniqueLetter).length,
  ]);
  lettersAndCounts.sort((a, b) => b[1] - a[1]);
  const letterCountDivs = lettersAndCounts.map((lc, index) => {
    return <div className="OneLC" key={index}>{`${lc[0]}: ${lc[1]} `}</div>;
  });
  return letterCountDivs;
}

LetterCount.propTypes = {
  encrypted: PropTypes.string,
};
