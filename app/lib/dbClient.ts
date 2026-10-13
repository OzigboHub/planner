import { neon } from "@neondatabase/serverless";

let sqlClient: ReturnType<typeof neon> | null = null;
let initialized = false;

export function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return null;
  }
  if (!sqlClient) {
    sqlClient = neon(dbUrl);
  }
  return sqlClient;
}

export async function ensureDbSchema() {
  if (initialized) return;
  const sql = getDb();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS planner_store (
        key VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tributes (
        id VARCHAR(100) PRIMARY KEY,
        author_name VARCHAR(255) NOT NULL,
        relationship VARCHAR(255) DEFAULT 'Family & Well-wisher',
        location VARCHAR(255) DEFAULT 'Nigeria',
        message TEXT NOT NULL,
        candle_lit INTEGER DEFAULT 1,
        is_pinned INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `;
    initialized = true;
  } catch (err) {
    console.error("Failed to ensure database schema:", err);
  }
}
