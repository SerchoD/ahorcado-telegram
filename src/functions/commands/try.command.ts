import { Context } from "telegraf";
import { regex } from "../../data/rexex.js";
import {
  areArraysEqual,
  generatePlayingWord,
  getRandomElement,
  quitarTildes,
  randomMinMax,
} from "../../utils/utils.js";
import { GameState } from "../bot.js";
import { CONSECUTIVE_FAIL_COMMENTS } from "../../data/data.js";

export const try_command = async (
  ctx: Context,
  gameState: GameState,
  resetGameCallBack: () => void
) => {
  // Check if the message is text
  const messageIsText = ctx.message && "text" in ctx.message;
  if (!messageIsText) {
    return;
  }

  // Split message into parts and get the letter to try
  const message: string[] = ctx.message.text.split(/\s+/);
  const letterToTry =
    message[1] && quitarTildes(message[1].toLocaleLowerCase());

  const isNumber = !isNaN(Number(message[1]));
  const isSymbol = !regex.onlyLetters.test(message[1]);

  if (
    message.length !== 2 ||
    message[1].length !== 1 ||
    isNumber ||
    isSymbol ||
    !letterToTry
  ) {
    await ctx.replyWithHTML(
      `\nLuego de "/try" debes mandar Una Letra Sola, no: "${
        message.slice(1).join(" ") || "nada"
      }"`
    );
    return;
  }

  // Check if secret word is set
  if (gameState.secretWord.length <= 0) {
    return await ctx.replyWithHTML(
      `\nDebe establecer una palabra con <b>/new_game</b> para empezar a jugar.`
    );
  }

  // Check if the letter was already tried
  const letterWasAlreadyTried = gameState.triedLetters.includes(letterToTry);
  if (letterWasAlreadyTried) {
    await ctx.replyWithHTML(
      `\nLa letra: '<b>${letterToTry.toUpperCase()}</b>' ya fue probada.`
    );
    await ctx.replyWithHTML(
      `\n<b>${gameState.playingWord.join(" ")}  ( ${gameState.wrongLetters.join(
        " "
      )} )</b>`
    );
    return;
  }

  // Add letter to tried letters
  gameState.triedLetters.push(letterToTry);

  // Check if letter is in secret word
  if (gameState.secretWord.includes(letterToTry)) {
    gameState.consecutiveFails = 0; // Reset consecutive fails on correct guess
  } else {
    gameState.consecutiveFails++; // Increment consecutive fails on wrong guess
    gameState.loseCounter++;
    gameState.wrongLetters.unshift(letterToTry);
    gameState.wrongLetters.pop();
  }

  // Update the playing word
  gameState.playingWord = generatePlayingWord(
    gameState.secretWord,
    gameState.triedLetters
  );

  // Check for win
  if (areArraysEqual(gameState.secretWord, gameState.playingWord)) {
    await ctx.replyWithHTML(
      `\n<b>${gameState.playingWord.join("")}  ( ${gameState.wrongLetters.join(
        " "
      )} )</b> - <b>VICTORIA! ✅✅✅</b>`
    );
    resetGameCallBack();
    return;
  }

  // Check for loss
  if (gameState.loseCounter === 6) {
    await ctx.replyWithHTML(
      `\n<b>${gameState.secretWord
        .map((e, index) => (index === 0 ? e.toUpperCase() : e))
        .join(
          ""
        )}  ( ${gameState.wrongLetters.join(" ")} )</b> - <b>DERROTA! ❌❌❌</b>`
    );
    resetGameCallBack();
    return;
  }

  // Send a random spicy comment if consecutive fails reach 4 or 5
  const failThreshold = randomMinMax(4, 5);
  if (gameState.consecutiveFails >= failThreshold) {
    const randomComment = getRandomElement(CONSECUTIVE_FAIL_COMMENTS);
    await ctx.replyWithHTML(
      `\n<span class='tg-spoiler'>${randomComment}</span>`
    );
  }

  return await ctx.replyWithHTML(
    `\n<b>${gameState.playingWord.join(" ")}  ( ${gameState.wrongLetters.join(
      " "
    )} )</b>`
  );
};
