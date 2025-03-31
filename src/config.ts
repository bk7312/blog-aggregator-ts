import fs from "node:fs";
import os from "node:os";
import path from "node:path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function readConfig(): Config {
  let config: Config = { dbUrl: "", currentUserName: "" };
  try {
    const raw = fs.readFileSync(getConfigFilePath(), "utf-8");
    const jsonData = JSON.parse(raw);
    // console.log(jsonData);
    config = validateConfig(jsonData);
  } catch (error) {
    console.log("readConfig error: ", error as Error);
  }
  return config;
}

export function setUser(user: string) {
  // writes Config obj to json after setting currentusername
  const { dbUrl } = readConfig();
  const config: Config = {
    dbUrl,
    currentUserName: user,
  };
  writeConfig(config);
}

function getConfigFilePath(): string {
  // return path.resolve(import.meta.dirname, ".gatorconfig.json");
  return path.resolve(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  try {
    const data = {
      db_url: cfg.dbUrl,
      current_user_name: cfg.currentUserName,
    };
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(data), "utf8");
  } catch (error) {
    console.log("writeConfig error: ", error as Error);
  }
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Config must be an object");
  }

  const { db_url: dbUrl, current_user_name: currentUserName } = rawConfig;

  if (typeof dbUrl !== "string" || dbUrl.length === 0) {
    throw new Error("dbUrl must be a non-empty string");
  }

  if (typeof currentUserName !== "string" || currentUserName.length === 0) {
    throw new Error("currentUserName must be a non-empty string");
  }

  return { dbUrl, currentUserName };
}
