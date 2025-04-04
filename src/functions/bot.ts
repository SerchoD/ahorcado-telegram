import { help_command } from "./commands/help.command.js";
import { reset_command } from "./commands/reset.command.js";
import { new_game } from "./commands/new_game.command.js";
import { bot } from "./config.js";
import { try_command } from "./commands/try.command.js";
import { Context } from "telegraf";
import { who_starts } from "./commands/who_starts.command.js";

// TODO Separar las diferentes partidas de cada chat
//      En diferentes objetos, dentro de un objeto
//      gameStateDB con hashes del chat_id.
// TODO ver si se puede hacer un initialState
// TODO Ver de poner frases picantes cada 4 errores seguidos

export interface GameState {
  triedLetters: string[];
  secretWord: string[];
  playingWord: string[];
  wrongLetters: string[];
  loseCounter: number;
  winCounter: number;
}

// Function to generate the initial game state
const initialState = (): GameState => ({
  triedLetters: [],
  secretWord: [],
  playingWord: [],
  wrongLetters: ["□", "□", "□", "□", "□", "□"],
  loseCounter: 0,
  winCounter: 0,
});

let gameState: GameState = initialState();

export const resetState = (): void => {
  gameState = initialState();
};

// RESET GAME
bot.command(["reset", "r"], (ctx: Context) => {
  reset_command(ctx);
});

// NEW GAME start a game
bot.command(["new_game", "n"], (ctx: Context) => {
  new_game(ctx, gameState);
});

// TRY a letter
bot.command(["try", "t"], (ctx: Context) => {
  try_command(ctx, gameState);
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
