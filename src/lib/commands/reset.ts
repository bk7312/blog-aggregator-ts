import { resetFeeds } from "../db/queries/feeds";
import { resetUsers } from "../db/queries/users";

export async function handleReset(cmdName: string, ...args: string[]) {
  try {
    await resetUsers();
    await resetFeeds();
  } catch (e) {
    console.error("error resetting users", e);
    process.exit(1);
  }
}
