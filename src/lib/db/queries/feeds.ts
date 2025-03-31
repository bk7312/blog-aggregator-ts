import { db } from "..";
import { feeds } from "../schema";
import { eq, and, sql } from "drizzle-orm";
import { createFeedFollow } from "./feed-follows";

export async function addFeed(name: string, url: string, userId: string) {
  const existing = await db
    .select()
    .from(feeds)
    .where(and(eq(feeds.name, name), eq(feeds.userId, userId)));
  if (existing.length > 0) {
    throw new Error(`feed already exist for user`);
  }

  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, userId })
    .returning();

  const newFeedFollow = await createFeedFollow(result.userId, result.id);

  return newFeedFollow;
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function resetFeeds(): Promise<void> {
  await db.delete(feeds);
}

export async function markFeedFetched(feedId: string) {
  const [result] = await db
    .update(feeds)
    .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, feedId));
  return result;
}

export async function getNextFeedToFetch() {
  // return next feed to fetch posts from
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} nulls first`)
    .limit(1);
  return result;
}
