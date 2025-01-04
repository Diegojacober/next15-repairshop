import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

if (process.env.NODE_ENV === "development") {
  config({ path: ".env.local" });
}
// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const sql = neon(process.env.DATABASE_URL!);

// logger
// export const db = drizzle({ client: sql, logger: true });
export const db = drizzle({ client: sql });
// export const db = drizzle({ client: sql });
