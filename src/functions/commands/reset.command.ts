import { Context } from "telegraf";
import { resetState } from "../bot.js";

export const reset_command = (ctx: Context) => {
  const RESET_MESSAGE = `\n¡Valores restablecidos! \n¡Listo para empezar!`;

  ctx.replyWithHTML(RESET_MESSAGE);

  resetState();
};
