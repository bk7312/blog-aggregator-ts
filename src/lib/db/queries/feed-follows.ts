import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { and, eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
  const [feedFollow] = await db
    .insert(feedFollows)
    .values({ feedId, userId })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, feedFollow.id));

  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAT: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .where(eq(feedFollows.userId, userId))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id));
  return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();

  return result;
}

// export async function resetFeedFollowss(): Promise<void> {
//   await db.delete(feedFollows);
// }
