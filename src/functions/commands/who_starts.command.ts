import { Context } from "telegraf";
import { formatName, getRandomElement } from "../../utils/utils.js";

export const who_starts = async (ctx: Context) => {
  if (ctx.message && "text" in ctx.message) {
    const message = ctx.message.text.split(/\s+/);
    const names = message.slice(1);

    if (!names || names.length === 0) {
      await ctx.replyWithHTML("Te olvidaste de poner los nombres...");
      return;
    }

    const whoStarts = formatName(getRandomElement(names));
    await ctx.replyWithHTML(`Empieza: <b>${whoStarts}.</b>`);
  } else {
    await ctx.replyWithHTML("No recibí un mensaje de texto...");
  }
};
