import { Context } from "telegraf";
import { regex } from "../../data/rexex.js";
import {
  generatePlayingWord,
  quitarTildes,
  wordToArray,
} from "../../utils/utils.js";
import { GameState } from "../bot.js";
import { bot } from "../config.js";

export const new_game = async (ctx: Context, gameState: GameState) => {
  // Extract necessary properties from ctx
  const { chat, botInfo, message } = ctx;

  // Check if the message exists and is a text message
  if (!message || !("text" in message)) {
    return await ctx.replyWithHTML(
      "Este comando solo funciona con mensajes de texto."
    );
  }

  const chatId = chat?.id;
  const botInfoId = botInfo?.id;
  const messageId = message?.message_id;
  const messageText = message.text;

  // Validate essential data
  if (!chatId || !botInfoId || !messageText || !messageId) {
    return await ctx.replyWithHTML(
      "Datos insuficientes en el contexto del mensaje."
    );
  }

  // Delete message if permissions are granted
  const deleteMessage = async () => {
    try {
      const chatMember = await bot.telegram.getChatMember(chatId, botInfoId);

      const canDeleteMessages =
        "can_delete_messages" in chatMember && chatMember.can_delete_messages; // This is to manage the bad typing from library
      if (canDeleteMessages) {
        await bot.telegram.deleteMessage(chatId, messageId);
      } else {
        return await ctx.replyWithHTML(
          `\nPor favor, <b><u>dame permiso de Administrador</u></b>, para Borrar Mensajes.`
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      return await ctx.replyWithHTML(
        `\nError al verificar permisos: ${errorMessage}`
      );
    }
  };

  const cantDeleteMessage = await deleteMessage();
  if (cantDeleteMessage) return;

  // Process the message to obtain the game word
  const messageParts = messageText.split(/\s+/);
  const wordInput = messageParts[1] && quitarTildes(messageParts[1]);

  const isNumber = !isNaN(Number(messageParts[1]));
  const isSymbol = !regex.onlyLetters.test(messageParts[1]);
  const isNotOneWord = messageParts.length !== 2;

  if (isNotOneWord || isNumber || isSymbol) {
    return await ctx.replyWithHTML(
      `\nPara empezar un Nuevo Juego, debes enviar una sola palabra, sin espacios, y solo con letras.`
    );
  }

  // Update game state with the chosen word and initial mask
  gameState.secretWord = wordToArray(wordInput.toLowerCase());
  gameState.playingWord = generatePlayingWord(
    gameState.secretWord,
    gameState.triedLetters
  );

  // Send the response to the chat
  await ctx.replyWithHTML(
    `\nSe inició un nuevo juego, suerte! \n <b>${gameState.playingWord.join(
      " "
    )}  ( ${gameState.wrongLetters.join(" ")} )</b>`
  );
};
