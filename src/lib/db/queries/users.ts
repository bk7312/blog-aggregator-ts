import { db } from "..";
import { users, User } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(name: string): Promise<User> {
  const existing = await db.select().from(users).where(eq(users.name, name));
  if (existing.length > 0) {
    throw new Error("can't create user, name already exist");
  }
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
}

export async function getUserById(id: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return result;
}

export async function getUsers(): Promise<User[]> {
  const result = await db.select().from(users);
  return result;
}

export async function resetUsers(): Promise<void> {
  await db.delete(users);
}
