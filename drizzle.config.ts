import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const { dbUrl } = readConfig();

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
