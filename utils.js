const wordToArray = (word) => word.split('');

const generatePlayingWord = (secretWord, lettersToTry) => {
	const playingWord = [];
	for (let i = 0; i < secretWord.length; i++) {
		if (lettersToTry.includes(secretWord[i])) {
			if (i === 0) {
				playingWord.push(secretWord[i].toUpperCase());
			} else {
				playingWord.push(secretWord[i]);
			}
		} else {
			playingWord.push('_');
		}
	}
	return playingWord;
};

const areArraysEqual = (arr1, arr2) => {
	if (arr1.length !== arr2.length) {
		return false;
	}

	return arr1.every(
		(element, index) => element.toLowerCase() === arr2[index].toLowerCase()
	);
};

const quitarTildes = (texto) => {
	const vocalesConTilde = 'áéíóúÁÉÍÓÚ';
	const vocalesSinTilde = 'aeiouAEIOU';
	let resultado = '';
	for (let i = 0; i < texto?.length; i++) {
		const indice = vocalesConTilde.indexOf(texto?.charAt(i));
		if (indice !== -1) {
			resultado += vocalesSinTilde.charAt(indice);
		} else {
			resultado += texto?.charAt(i);
		}
	}
	return resultado;
};

const getRandomElement = (array) => {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
};

const formatName = (name) => {
	const lowerCaseName = name.toLowerCase();
	const formattedName =
		lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);
	return formattedName;
};

module.exports = {
	formatName,
	getRandomElement,
	quitarTildes,
	wordToArray,
	generatePlayingWord,
	areArraysEqual,
};
