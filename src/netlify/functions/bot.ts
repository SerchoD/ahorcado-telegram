import { help_command } from "./commands/help.command.js";
import { reset_command } from "./commands/reset.command.js";
import { new_game } from "./commands/new_game.command.js";
import { bot } from "../../config/config.js";
import { try_command } from "./commands/try.command.js";
import { Context } from "telegraf";
import { who_starts } from "./commands/who_starts.command.js";

export interface GameState {
  triedLetters: string[];
  secretWord: string[];
  playingWord: string[];
  wrongLetters: string[];
  loseCounter: number;
  winCounter: number;
  consecutiveFails: number;
}

// Initial game state generator
const initialState = (): GameState => ({
  triedLetters: [],
  secretWord: [],
  playingWord: [],
  wrongLetters: ["□", "□", "□", "□", "□", "□"],
  loseCounter: 0,
  winCounter: 0,
  consecutiveFails: 0,
});

// Game state database for multiple chats
const gameState_DB: { [chat_id: string]: GameState } = {};

// Function to get or create the game state for a chat
export const getGameState = (chat_id: string): GameState => {
  if (!gameState_DB[chat_id]) {
    gameState_DB[chat_id] = initialState();
  }
  return gameState_DB[chat_id];
};

const resetGame = (chat_id: string) => {
  gameState_DB[chat_id] = initialState();
};

// RESET GAME
bot.command(["reset", "r"], (ctx: Context) => {
  const chat_id = String(ctx.chat?.id);
  resetGame(chat_id);
  reset_command(ctx);
});

// NEW GAME start a game
bot.command(["new_game", "n"], (ctx: Context) => {
  const chat_id = String(ctx.chat?.id);
  resetGame(chat_id);
  const gameState = getGameState(chat_id);
  new_game(ctx, gameState);
});

// TRY a letter
bot.command(["try", "t"], (ctx: Context) => {
  const chat_id = String(ctx.chat?.id);
  const gameState = getGameState(chat_id);
  const resetGameCallback = () => resetGame(chat_id);

  try_command(ctx, gameState, resetGameCallback);
});

// WHO STARTS - pick a random player
bot.command(["who_starts", "w"], (ctx: Context) => {
  who_starts(ctx);
});

// HELP Show commands in chat
bot.command(["help", "h"], (ctx: Context) => {
  help_command(ctx);
});

bot.launch();
