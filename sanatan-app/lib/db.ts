import "dotenv/config";
import { Pool } from "pg";

declare global {
  var __sanatanPool: Pool | undefined;
}

export const db =
  global.__sanatanPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  global.__sanatanPool = db;
}
