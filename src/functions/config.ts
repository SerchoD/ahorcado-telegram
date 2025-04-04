import { config } from "dotenv";
import path from "path";
import { Telegraf } from "telegraf";

config({ path: path.join(process.cwd(), ".env") });

const HTTP_API_TOKEN = process.env.AHORCADO_BOT_HTTP_API_TOKEN;

if (!HTTP_API_TOKEN) {
  console.error("Error: HTTP_API_TOKEN is not defined");
  process.exit(1);
}

export const bot = new Telegraf(HTTP_API_TOKEN);

if (bot) {
  console.info("\x1b[1m\x1b[37m>>> Bot Running!\x1b[0m");
}
