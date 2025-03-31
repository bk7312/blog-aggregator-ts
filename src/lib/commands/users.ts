import { readConfig, setUser } from "../../config";
import { createUser, getUser, getUsers } from "../db/queries/users";
import { User } from "../db/schema";

export async function handleLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("no args in login command");
  }
  let user: User;
  try {
    user = await getUser(args[0]);
    if (user === undefined) {
      console.error("user not found");
      process.exit(1);
    }
  } catch (e) {
    console.error("login error", e);
  }
  setUser(args[0]);
  console.log("username set as", args[0]);
}

export async function handleRegister(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("no args in register command");
  }
  const name = args[0];
  let user: User;
  try {
    user = await createUser(name);
  } catch (e) {
    console.error("error", e);
    process.exit(1);
  }
  setUser(user.name);
  console.log(`user ${user.name} successfully registered`);
}

export async function handleUsers(cmdName: string, ...args: string[]) {
  let users: User[];
  const { currentUserName } = readConfig();
  try {
    users = await getUsers();
  } catch (e) {
    console.error("error getting all users", e);
    process.exit(1);
  }
  for (let user of users) {
    let str = `* ${user.name}`;
    if (user.name === currentUserName) {
      str += " (current)";
    }
    console.log(str);
  }
}
