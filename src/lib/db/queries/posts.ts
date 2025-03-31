import { db } from "..";
import { feedFollows, posts, feeds } from "../schema";
import { eq, desc } from "drizzle-orm";
import { getFeedFollowsForUser } from "./feed-follows";
import { RSSItem } from "../../rss";

export async function createPost(post: RSSItem, feedId: string) {
  const exist = await db.select().from(posts).where(eq(posts.url, post.link));
  if (exist.length > 0) {
    console.log("post already in db", post.link);
    return;
  }
  await db.insert(posts).values({
    title: post.title,
    url: post.link,
    publishedAt: new Date(post.pubDate),
    feedId: feedId,
    description: post.description,
  });
}
export async function getPostsForUser(userId: string, limit: number) {
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      published: posts.publishedAt,
      description: posts.description,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}
