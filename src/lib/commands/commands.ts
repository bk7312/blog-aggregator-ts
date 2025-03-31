import { handleLogin, handleRegister, handleUsers } from "./users";
import { handleAddFeed, handleFeeds } from "./feeds";
import { handleFollow, handleFollowing, handleUnfollow } from "./feed-follows";
import { handleReset } from "./reset";
import { handleAgg, handleBrowse } from "./aggregate";
import { middlewareLoggedIn } from "../middleware";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

const commReg: CommandsRegistry = {};

registerCommand(commReg, "login", handleLogin);
registerCommand(commReg, "register", handleRegister);
registerCommand(commReg, "reset", handleReset);
registerCommand(commReg, "users", handleUsers);
registerCommand(commReg, "agg", handleAgg);
registerCommand(commReg, "addfeed", middlewareLoggedIn(handleAddFeed));
registerCommand(commReg, "feeds", handleFeeds);
registerCommand(commReg, "follow", middlewareLoggedIn(handleFollow));
registerCommand(commReg, "following", middlewareLoggedIn(handleFollowing));
registerCommand(commReg, "unfollow", middlewareLoggedIn(handleUnfollow));
registerCommand(commReg, "browse", middlewareLoggedIn(handleBrowse));
registerCommand(commReg, "help", handleHelp);

function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  return registry[cmdName](cmdName, ...args);
}

async function handleHelp(cmdName: string, ...args: string[]) {
  console.log("List of available commands below:");
  for (let key of Object.keys(commReg)) {
    console.log(key);
  }
}

export { commReg };
