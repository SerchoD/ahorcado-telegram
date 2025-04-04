import { Context } from "telegraf";

export const reset_command = (ctx: Context) => {
  const RESET_MESSAGE = `\n¡Valores restablecidos! \n¡Listo para empezar!`;
  ctx.replyWithHTML(RESET_MESSAGE);
};
