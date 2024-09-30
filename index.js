require('dotenv').config();
const { Telegraf } = require('telegraf');
const {
	wordToArray,
	generatePlayingWord,
	areArraysEqual,
	quitarTildes,
	getRandomElement,
	formatName,
} = require('./utils');
const { HELP } = require('./data');

const HTTP_API_TOKEN = process.env.AHORCADO_BOT_HTTP_API_TOKEN;
console.log('AHORCADO_BOT_HTTP_API_TOKEN: ', HTTP_API_TOKEN);
const BOT = '';

const bot = new Telegraf(HTTP_API_TOKEN);

const regex = { onlyLetters: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/ };
// ---

let state = {
	triedLetters: [],
	secretWord: [],
	playingWord: [],
	wrongLetters: ['■', '■', '■', '■', '■', '■'],
};
const resetState = () => {
	state = {
		triedLetters: [],
		secretWord: [],
		playingWord: [],
		wrongLetters: ['■', '■', '■', '■', '■', '■'],
		loseCounter: 0,
		winCounter: 0,
	};
};

bot.command('reset', (ctx) => {
	ctx.replyWithHTML(
		`<b>${BOT}</b> \nValores restablecidos! \nListo para empezar!`
	);

	resetState();
});

bot.command('new_game', async (ctx) => {
	const deleteMessage = async () => {
	  try {
		const chatMember = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id);
		const canDeleteMessages = chatMember?.can_delete_messages;
  
		if (canDeleteMessages) {
		  await bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
		} else {
		  ctx.replyWithHTML(`<b>${BOT}</b> \nNo tengo permisos para borrar mensajes.`);
		}
	  } catch (error) {
		ctx.replyWithHTML(`<b>${BOT}</b> \nError al verificar permisos: ${error.message}`);
	  }
	};
  
	resetState();
	await deleteMessage();
  
	const message = ctx?.message?.text?.split(/\s+/);
	const word = quitarTildes(message[1]);
  
	const isNumber = !isNaN(message[1]);
	const isSimbol = !regex.onlyLetters.test(message[1]);
  
	if (message.length !== 2 || isNumber || isSimbol) {
	  ctx.replyWithHTML(
		`<b>${BOT}</b> \nPara empezar una Nuevo Juego, debes enviar una sola palabra, sin espacios, y solo con letras.`
	  );
	  return;
	}
  
	state.secretWord = wordToArray(word.toLowerCase());
	state.playingWord = generatePlayingWord(state?.secretWord, state?.triedLetters);
  
	ctx.replyWithHTML(
	  `<b>${BOT}</b> \nSe inició un nuevo juego, suerte! \n <b>${state?.playingWord?.join(
		' '
	  )}  ( ${state?.wrongLetters.join(' ')} )</b>`
	);
  });
  

bot.command('try', (ctx) => {
	const message = ctx?.message?.text?.split(/\s+/);
	const letterToTry = quitarTildes(message[1]?.toLocaleLowerCase());

	const isNumber = !isNaN(message[1]);
	const isSimbol = !regex.onlyLetters.test(message[1]);

	if (
		message?.length !== 2 ||
		message[1]?.length != 1 ||
		isNumber ||
		isSimbol ||
		!letterToTry
	) {
		ctx.replyWithHTML(
			`<b>${BOT}</b> \nLuego de "/try" debes mandar Una Letra Sola, no: "${
				message?.slice(1).join(' ') || 'nada'
			}"`
		);
		return;
	}

	const isSecretWord = state?.secretWord.length <= 0;

	if (isSecretWord) {
		ctx.replyWithHTML(
			`<b>${BOT}</b> \nDebe establecer una palabra con <b>/new_game</b> para empezar a jugar.`
		);
		return;
	}

	const letterWasAlreadyTried = state?.triedLetters?.includes(letterToTry);

	if (!letterWasAlreadyTried) {
		state.triedLetters.push(letterToTry);
	}
	state.playingWord = generatePlayingWord(
		state?.secretWord,
		state?.triedLetters
	);

	if (letterWasAlreadyTried) {
		ctx.replyWithHTML(
			`<b>${BOT}</b> \nLa letra: '<b>${letterToTry?.toUpperCase()}</b>' ya fue probada.`
		);
		ctx.replyWithHTML(
			`<b>${BOT}</b> \n <b>${state?.playingWord?.join(
				' '
			)}  ( ${state?.wrongLetters.join(' ')} )</b>`
		);
		return;
	}

	// Almacena una letra si es erroena
	state?.triedLetters.forEach((letter) => {
		if (
			!state?.secretWord.includes(letter) &&
			!state?.wrongLetters.includes(letter)
		) {
			state.loseCounter = state?.loseCounter + 1;
			state.wrongLetters.unshift(letter);
			state.wrongLetters.pop();
		}
	});

	// Evalua si Ganaste
	if (areArraysEqual(state?.secretWord, state?.playingWord)) {
		ctx.replyWithHTML(
			`<b>${BOT}</b> \n <b>${state?.playingWord?.join(
				''
			)}  ( ${state?.wrongLetters.join(' ')} )</b> - <b>VICTORIA! ✅✅✅</b>`
		);
		resetState();
		return;
	}

	// Evalua si Perdiste
	if (state?.loseCounter === 6) {
		ctx.replyWithHTML(
			`<b>${BOT}</b> \n <b>${state?.secretWord
				?.map((e, index) => {
					if (index === 0) {
						return e.toUpperCase();
					} else {
						return e;
					}
				})
				.join('')}  ( ${state?.wrongLetters.join(
				' '
			)} )</b> - <b>DERROTA! ❌❌❌</b>`
		);
		resetState();
		return;
	}

	ctx.replyWithHTML(
		`<b>${BOT}</b> \n <b>${state?.playingWord?.join(
			' '
		)}  ( ${state?.wrongLetters.join(' ')} )</b>`
	);
});

bot.help((ctx) => {
	HELP?.map((e) => {
		ctx?.reply(e);
	});
});

bot.command('who_starts', (ctx) => {
	const message = ctx.message.text.split(/\s+/);
	const names = message.slice(1);

	if (!names || !message) {
		ctx.replyWithHTML(`Te olvidaste de poner los nombres...`);
	}

	const whoStarts = formatName(getRandomElement(names));

	ctx.replyWithHTML(`Empieza: <b>${whoStarts}.</b>`);
});

bot.launch();
