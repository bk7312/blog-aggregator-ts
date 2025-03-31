import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "../db/queries/feed-follows";
import { getFeedByUrl } from "../db/queries/feeds";
import { User } from "../db/schema";

export async function handleFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error("incorrect args in follow command");
  }
  let feed;
  let feedFollows;
  try {
    feed = await getFeedByUrl(args[0]);
    feedFollows = await createFeedFollow(user.id, feed.id);
  } catch (e) {
    console.error("error creating feed follow", e);
    process.exit(1);
  }
  //   for (let feed of feeds) {
  //     let user: User;
  //     try {
  //       user = await getUserById(feed.userId);
  //     } catch (e) {
  //       console.error("error getting user for feed", e);
  //       process.exit(1);
  //     }
  //     console.log({ feed: feed.name, url: feed.url, username: user.name });
  //   }
}

export async function handleFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let feeds;
  try {
    feeds = await getFeedFollowsForUser(user.id);
  } catch (e) {
    console.error("error getting feed follows for user", e);
    process.exit(1);
  }
  for (let feed of feeds) {
    console.log(feed.feedName);
  }
}

export async function handleUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error("incorrect args in follow command");
  }
  let feed;
  let feedFollows;
  try {
    feed = await getFeedByUrl(args[0]);
    feedFollows = await deleteFeedFollow(user.id, feed.id);
  } catch (e) {
    console.error("error creating feed follow", e);
    process.exit(1);
  }
}
