import fs from "fs";
import path from "path";
import { getDb, ensureDbSchema } from "./dbClient";

export interface DBTribute {
  id: string;
  author_name: string;
  relationship: string;
  location: string;
  message: string;
  candle_lit: number; // 0 or 1
  is_pinned?: number; // 0 or 1
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "tributes.json");
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Clean slate: no fabricated mock tributes
const initialSeedTributes: DBTribute[] = [];

function ensureDbFile(): void {
  if (isServerless) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedTributes, null, 2), "utf8");
    }
  } catch {
    // Read-only filesystem
  }
}

function getLocalTributes(): DBTribute[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      const list: DBTribute[] = JSON.parse(raw);
      return list.sort((a, b) => {
        if ((b.is_pinned || 0) !== (a.is_pinned || 0)) {
          return (b.is_pinned || 0) - (a.is_pinned || 0);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }
  } catch (err) {
    console.warn("Could not read local tributes file, returning empty list:", err);
  }
  return [];
}

function saveLocalTributes(list: DBTribute[]): void {
  if (isServerless) return;
  try {
    ensureDbFile();
    const tempFile = DB_FILE + ".tmp";
    fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), "utf8");
    fs.renameSync(tempFile, DB_FILE);
  } catch {
    // Read-only filesystem
  }
}

export async function getAllTributes(): Promise<DBTribute[]> {
  const sql = getDb();
  if (sql) {
    try {
      await ensureDbSchema();
      const rows = (await sql`
        SELECT id, author_name, relationship, location, message, candle_lit, is_pinned, created_at
        FROM tributes
        ORDER BY is_pinned DESC, created_at DESC;
      `) as DBTribute[];

      return rows;
    } catch (err) {
      console.error("Failed to fetch tributes from Neon, falling back to local file:", err);
    }
  }

  return getLocalTributes();
}

export async function insertTribute(data: {
  author_name: string;
  relationship?: string;
  location?: string;
  message: string;
  candle_lit?: boolean;
}): Promise<DBTribute> {
  const id = "trib-" + Date.now();
  const created_at = new Date().toISOString().replace("T", " ").substring(0, 16);
  const candle_lit = data.candle_lit === false ? 0 : 1;
  const relationship = data.relationship?.trim() || "Family & Well-wisher";
  const location = data.location?.trim() || "Nigeria";
  const author_name = data.author_name.trim();
  const message = data.message.trim();

  const newTribute: DBTribute = {
    id,
    author_name,
    relationship,
    location,
    message,
    candle_lit,
    is_pinned: 0,
    created_at,
  };

  const sql = getDb();
  if (sql) {
    try {
      await ensureDbSchema();
      await sql`
        INSERT INTO tributes (id, author_name, relationship, location, message, candle_lit, is_pinned, created_at)
        VALUES (${id}, ${author_name}, ${relationship}, ${location}, ${message}, ${candle_lit}, 0, ${created_at});
      `;
    } catch (err) {
      console.error("Failed to insert tribute into Neon:", err);
    }
  }

  const current = getLocalTributes();
  const updated = [newTribute, ...current];
  saveLocalTributes(updated);

  return newTribute;
}

export async function deleteTribute(id: string): Promise<boolean> {
  const sql = getDb();
  if (sql) {
    try {
      await ensureDbSchema();
      await sql`DELETE FROM tributes WHERE id = ${id};`;
    } catch (err) {
      console.error("Failed to delete tribute from Neon:", err);
    }
  }

  const current = getLocalTributes();
  const filtered = current.filter((t) => t.id !== id);
  if (filtered.length === current.length) {
    return false;
  }

  saveLocalTributes(filtered);
  return true;
}
