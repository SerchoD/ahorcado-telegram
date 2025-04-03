// Splits a word into an array of letters
export const wordToArray = (word) => word.split("");

// Generates the playing word based on tried letters
export const generatePlayingWord = (secretWord, lettersToTry) => {
  return secretWord.map((letter, index) =>
    lettersToTry.includes(letter)
      ? index === 0
        ? letter.toUpperCase()
        : letter
      : "_"
  );
};

// Compares two arrays, ignoring case
export const areArraysEqual = (arr1, arr2) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((el, i) => el.toLowerCase() === arr2[i].toLowerCase())
  );
};

// Removes accents from a given text
export const quitarTildes = (text) => {
  const accents = "áéíóúÁÉÍÓÚ";
  const noAccents = "aeiouAEIOU";
  return text.replace(
    /[áéíóúÁÉÍÓÚ]/g,
    (match) => noAccents[accents.indexOf(match)]
  );
};

// Returns a random element from an array
export const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Formats a name with the first letter capitalized
export const formatName = (name) =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
