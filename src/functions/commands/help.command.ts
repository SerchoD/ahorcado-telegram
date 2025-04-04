import { Context } from "telegraf";
import { HELP } from "../../data/data.js";

export const help_command = (ctx: Context) => {
  HELP.forEach((e) => {
    ctx.reply(e);
  });
};
