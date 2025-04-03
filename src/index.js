// Refactor del bot de Ahorcado usando Telegraf
require("dotenv").config();
const { Telegraf } = require("telegraf");
const {
  wordToArray,
  generatePlayingWord,
  areArraysEqual,
  quitarTildes,
  getRandomElement,
  formatName,
} = require("./utils");
const { HELP } = require("./data");

const HTTP_API_TOKEN = process.env.AHORCADO_BOT_HTTP_API_TOKEN;
const BOT = "";
const bot = new Telegraf(HTTP_API_TOKEN);

const regex = { onlyLetters: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/ };

let state = initializeState();

function initializeState() {
  return {
    triedLetters: [],
    secretWord: [],
    playingWord: [],
    wrongLetters: Array(6).fill("■"),
    loseCounter: 0,
    winCounter: 0,
  };
}

function resetState() {
  state = initializeState();
}

function validateMessage(ctx, message) {
  const isNumber = !isNaN(message);
  const isSymbol = !regex.onlyLetters.test(message);
  return message?.length !== 1 || isNumber || isSymbol || !message;
}

function handleMessage(ctx, text) {
  ctx.replyWithHTML(`<b>${BOT}</b> \n${text}`);
}

async function deleteMessage(ctx) {
  try {
    const chatMember = await bot.telegram.getChatMember(
      ctx.chat.id,
      ctx.botInfo.id
    );
    if (chatMember?.can_delete_messages) {
      await bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
    } else {
      handleMessage(ctx, "No tengo permisos para borrar mensajes.");
    }
  } catch (error) {
    handleMessage(ctx, `Error al verificar permisos: ${error.message}`);
  }
}

bot.command("reset", (ctx) => {
  handleMessage(ctx, "Valores restablecidos! Listo para empezar!");
  resetState();
});

bot.command("new_game", async (ctx) => {
  resetState();
  await deleteMessage(ctx);
  const [_, word] = ctx?.message?.text?.split(/\s+/);
  if (validateMessage(ctx, word)) {
    handleMessage(ctx, "Envía una palabra válida para empezar un nuevo juego.");
    return;
  }
  state.secretWord = wordToArray(quitarTildes(word.toLowerCase()));
  state.playingWord = generatePlayingWord(state.secretWord, state.triedLetters);
  handleMessage(
    ctx,
    `Se inició un nuevo juego, suerte! \n<b>${state.playingWord.join(
      " "
    )} ( ${state.wrongLetters.join(" ")} )</b>`
  );
});

bot.command("try", (ctx) => {
  const [_, letter] = ctx?.message?.text?.split(/\s+/);
  const letterToTry = quitarTildes(letter?.toLowerCase());
  if (validateMessage(ctx, letterToTry)) {
    handleMessage(ctx, "Envía una letra válida.");
    return;
  }
  if (!state.secretWord.length) {
    handleMessage(ctx, "Establece una palabra con /new_game para jugar.");
    return;
  }
  if (state.triedLetters.includes(letterToTry)) {
    handleMessage(ctx, `La letra '${letterToTry}' ya fue probada.`);
    return;
  }
  state.triedLetters.push(letterToTry);
  state.playingWord = generatePlayingWord(state.secretWord, state.triedLetters);
  if (areArraysEqual(state.secretWord, state.playingWord)) {
    handleMessage(ctx, `Ganaste! Palabra: ${state.playingWord.join("")}`);
    resetState();
    return;
  }
  if (!state.secretWord.includes(letterToTry)) {
    state.loseCounter++;
    state.wrongLetters.push(letterToTry);
    state.wrongLetters.shift();
    if (state.loseCounter >= 6) {
      handleMessage(
        ctx,
        `Perdiste! La palabra era: ${state.secretWord.join("")}`
      );
      resetState();
      return;
    }
  }
  handleMessage(
    ctx,
    `<b>${state.playingWord.join(" ")} ( ${state.wrongLetters.join(" ")} )</b>`
  );
});

bot.command("who_starts", (ctx) => {
  const names = ctx.message.text.split(/\s+/).slice(1);
  if (!names.length)
    return handleMessage(ctx, "Te olvidaste de poner los nombres...");
  const whoStarts = formatName(getRandomElement(names));
  handleMessage(ctx, `Empieza: <b>${whoStarts}</b>`);
});

bot.help((ctx) => HELP.forEach((e) => ctx.reply(e)));
bot.launch();
