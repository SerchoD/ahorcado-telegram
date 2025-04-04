import { Context } from "telegraf";

export const reset_command = async (ctx: Context) => {
  const RESET_MESSAGE = `\n¡Valores restablecidos! \n¡Listo para empezar!`;
  await ctx.replyWithHTML(RESET_MESSAGE);
};
