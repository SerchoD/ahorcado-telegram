import { Context } from "telegraf";
import { regex } from "../../data/rexex.js";
import {
  areArraysEqual,
  generatePlayingWord,
  quitarTildes,
} from "../../utils/utils.js";
import { GameState } from "../bot.js";

export const try_command = (ctx: Context, gameState: GameState) => {
  const messageIsText = ctx.message && "text" in ctx.message;

  if (!messageIsText) {
    // Stops if message is not a text: (audio, picture, etc...)
    return;
  }

  const message: string[] = ctx?.message?.text?.split(/\s+/);
  const letterToTry =
    message[1] && quitarTildes(message[1]?.toLocaleLowerCase());

  const isNumber = !isNaN(Number(message[1]));
  const isSimbol = !regex.onlyLetters.test(message[1]);

  if (
    message?.length !== 2 ||
    message[1]?.length != 1 ||
    isNumber ||
    isSimbol ||
    !letterToTry
  ) {
    ctx.replyWithHTML(
      `\nLuego de "/try" debes mandar Una Letra Sola, no: "${
        message?.slice(1).join(" ") || "nada"
      }"`
    );
    return;
  }

  const isSecretWord = gameState?.secretWord.length <= 0;

  if (isSecretWord) {
    ctx.replyWithHTML(
      `\nDebe establecer una palabra con <b>/new_game</b> para empezar a jugar.`
    );
    return;
  }

  const letterWasAlreadyTried = gameState?.triedLetters?.includes(letterToTry);

  if (!letterWasAlreadyTried) {
    gameState.triedLetters.push(letterToTry);
  }
  gameState.playingWord = generatePlayingWord(
    gameState?.secretWord,
    gameState?.triedLetters
  );

  if (letterWasAlreadyTried) {
    ctx.replyWithHTML(
      `\nLa letra: '<b>${letterToTry?.toUpperCase()}</b>' ya fue probada.`
    );
    ctx.replyWithHTML(
      `\n <b>${gameState?.playingWord?.join(
        " "
      )}  ( ${gameState?.wrongLetters.join(" ")} )</b>`
    );
    return;
  }

  // Almacena una letra si es erroena
  gameState?.triedLetters.forEach((letter: string) => {
    if (
      !gameState?.secretWord.includes(letter) &&
      !gameState?.wrongLetters.includes(letter)
    ) {
      gameState.loseCounter = gameState?.loseCounter + 1;
      gameState.wrongLetters.unshift(letter);
      gameState.wrongLetters.pop();
    }
  });

  // Evalua si Ganaste
  if (areArraysEqual(gameState?.secretWord, gameState?.playingWord)) {
    return ctx.replyWithHTML(
      `\n <b>${gameState?.playingWord?.join(
        ""
      )}  ( ${gameState?.wrongLetters.join(
        " "
      )} )</b> - <b>VICTORIA! ✅✅✅</b>`
    );
  }

  // Evalua si Perdiste
  if (gameState?.loseCounter === 6) {
    return ctx.replyWithHTML(
      `\n <b>${gameState?.secretWord
        ?.map((e, index) => {
          if (index === 0) {
            return e.toUpperCase();
          } else {
            return e;
          }
        })
        .join("")}  ( ${gameState?.wrongLetters.join(
        " "
      )} )</b> - <b>DERROTA! ❌❌❌</b>`
    );
  }

  return ctx.replyWithHTML(
    `\n <b>${gameState?.playingWord?.join(
      " "
    )}  ( ${gameState?.wrongLetters.join(" ")} )</b>`
  );
};
