import { addFeed, getFeeds } from "../db/queries/feeds";
import { getUserById } from "../db/queries/users";
import { User } from "../db/schema";

export async function handleAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error("incorrect args in addfeed command");
  }
  const [name, url] = args;
  let feedObj;
  try {
    feedObj = await addFeed(name, url, user.id);
    console.log("feed: ", feedObj.feedName);
    console.log("user: ", feedObj.userName);
  } catch (e) {
    console.error("error adding feed", e);
    process.exit(1);
  }
}

export async function handleFeeds(cmdName: string, ...args: string[]) {
  let feeds;
  try {
    feeds = await getFeeds();
  } catch (e) {
    console.error("error getting feeds", e);
    process.exit(1);
  }
  for (let feed of feeds) {
    let user: User;
    try {
      user = await getUserById(feed.userId);
    } catch (e) {
      console.error("error getting user for feed", e);
      process.exit(1);
    }
    console.log({ feed: feed.name, url: feed.url, username: user.name });
  }
}
