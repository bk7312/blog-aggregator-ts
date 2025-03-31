import { getNextFeedToFetch, markFeedFetched } from "../db/queries/feeds";
import { createPost, getPostsForUser } from "../db/queries/posts";
import { User } from "../db/schema";
import { fetchFeed } from "../rss";
import { handleError, parseDuration } from "../utils";

export async function handleAgg(cmdName: string, ...args: string[]) {
  // let url = "https://www.wagslane.dev/index.xml";

  if (args.length !== 1) {
    console.error("insufficient args for agg");
    process.exit(1);
  }
  const time = parseDuration(args[0]);
  if (isNaN(time)) {
    console.error("invalid time arg");
    process.exit(1);
  }
  console.log("Collecting feeds every", args[0]);
  console.log("--------------------");
  scrapeFeeds().catch(handleError);
  const interval = setInterval(() => scrapeFeeds().catch(handleError), time);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function scrapeFeeds() {
  const toFetch = await getNextFeedToFetch();
  const feed = await fetchFeed(toFetch.url);
  markFeedFetched(toFetch.id);
  console.log("----------");
  console.log("Articles for RSS feed: ", feed.channel.title);
  console.log(feed.channel.item.length, "articles found");
  console.log("----------");
  for (let item of feed.channel.item) {
    try {
      await createPost(item, toFetch.id);
    } catch (e) {
      console.error("error creating post", e);
    }
  }
}

export async function handleBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit = 2;
  if (args.length === 1) {
    const num = parseInt(args[0]);
    if (!isNaN(num)) {
      limit = num;
    } else {
      console.error("invalid arg, default to 2");
    }
  }
  const posts = await getPostsForUser(user.id, limit);
  console.log("Found", posts.length, "articles for", user.name);
  console.log("--------------------");
  for (let p of posts) {
    console.log("Title:", p.title);
    console.log("Description:", p.description);
    console.log("URL:", p.url);
    console.log("Published:", p.published);
    console.log("Feed:", p.feedName);
    console.log("----------");
  }
}
