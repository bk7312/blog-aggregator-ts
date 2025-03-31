import { readConfig } from "../config";
import { CommandHandler } from "./commands/commands";
import { getUser } from "./db/queries/users";
import { User } from "./db/schema";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type middlewareHandler = (handler: UserCommandHandler) => CommandHandler;

export const middlewareLoggedIn: middlewareHandler = function (
  handler: UserCommandHandler
): CommandHandler {
  return async function (cmdName: string, ...args: string[]): Promise<void> {
    const { currentUserName } = readConfig();
    const user: User = await getUser(currentUserName);
    if (!user) {
      throw new Error(`User ${currentUserName} not found`);
    }

    await handler(cmdName, user, ...args);
  };
};
