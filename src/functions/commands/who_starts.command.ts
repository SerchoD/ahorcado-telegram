import { Context } from "telegraf";
import { formatName, getRandomElement } from "../../utils/utils.js";

export const who_starts = (ctx: Context) => {
  if (ctx.message && "text" in ctx.message) {
    const message = ctx.message.text.split(/\s+/);
    const names = message.slice(1);

    if (!names || names.length === 0) {
      ctx.replyWithHTML("Te olvidaste de poner los nombres...");
      return;
    }

    const whoStarts = formatName(getRandomElement(names));
    ctx.replyWithHTML(`Empieza: <b>${whoStarts}.</b>`);
  } else {
    ctx.replyWithHTML("No recibí un mensaje de texto...");
  }
};
