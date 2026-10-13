const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL from .env.local or .env
function getDbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  for (const file of ['.env.local', '.env']) {
    const p = path.join(__dirname, '..', file);
    if (fs.existsSync(p)) {
      const match = fs.readFileSync(p, 'utf8').match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match) return match[1];
    }
  }
  return null;
}

const connectionString = getDbUrl();
if (!connectionString) {
  console.error("DATABASE_URL not found in environment or .env/.env.local");
  process.exit(1);
}

async function migrate() {
  const sql = neon(connectionString);

  console.log("1. Ensuring tables in Neon PostgreSQL...");

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

  console.log("Tables verified.");

  const plannerPath = path.join(__dirname, '..', 'data', 'planner.json');
  if (fs.existsSync(plannerPath)) {
    console.log("2. Syncing data from planner.json...");
    const raw = fs.readFileSync(plannerPath, 'utf8');
    const plannerData = JSON.parse(raw);

    for (const [key, value] of Object.entries(plannerData)) {
      await sql`
        INSERT INTO planner_store (key, data, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = NOW();
      `;
      console.log(`- Synced key: ${key}`);
    }
  }

  const tributesPath = path.join(__dirname, '..', 'data', 'tributes.json');
  if (fs.existsSync(tributesPath)) {
    const raw = fs.readFileSync(tributesPath, 'utf8');
    const tributes = JSON.parse(raw);
    if (Array.isArray(tributes) && tributes.length > 0) {
      console.log("3. Syncing tributes...");
      for (const t of tributes) {
        await sql`
          INSERT INTO tributes (id, author_name, relationship, location, message, candle_lit, is_pinned, created_at)
          VALUES (${t.id}, ${t.author_name}, ${t.relationship || 'Family & Well-wisher'}, ${t.location || 'Nigeria'}, ${t.message}, ${t.candle_lit ?? 1}, ${t.is_pinned ?? 0}, ${t.created_at})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
