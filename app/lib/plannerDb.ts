import fs from "fs";
import path from "path";
import {
  BudgetItem,
  ProgrammeActivity,
  EventSettings,
  FamilyMember,
  ShoppingItem,
  RenovationItem,
  VendorItem,
} from "../types";
import {
  initialBudgetItems,
  initialProgramme,
  initialEventSettings,
  initialFamilyMembers,
  initialShoppingList,
  initialRenovationItems,
  initialVendors,
} from "../data/initialData";
import { getDb, ensureDbSchema } from "./dbClient";

export interface SharedPlannerData {
  budget: BudgetItem[];
  programme: ProgrammeActivity[];
  settings: EventSettings;
  familyMembers: FamilyMember[];
  shopping: ShoppingItem[];
  renovation: RenovationItem[];
  vendors: VendorItem[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PLANNER_FILE = path.join(DATA_DIR, "planner.json");

function ensurePlannerFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PLANNER_FILE)) {
    const initialData: SharedPlannerData = {
      budget: initialBudgetItems,
      programme: initialProgramme,
      settings: initialEventSettings,
      familyMembers: initialFamilyMembers,
      shopping: initialShoppingList,
      renovation: initialRenovationItems,
      vendors: initialVendors,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(PLANNER_FILE, JSON.stringify(initialData, null, 2), "utf8");
  }
}

function getLocalPlannerData(): SharedPlannerData {
  ensurePlannerFile();
  try {
    const raw = fs.readFileSync(PLANNER_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      budget: Array.isArray(parsed.budget) ? parsed.budget : initialBudgetItems,
      programme: Array.isArray(parsed.programme) ? parsed.programme : initialProgramme,
      settings: parsed.settings ? { ...initialEventSettings, ...parsed.settings } : initialEventSettings,
      familyMembers: Array.isArray(parsed.familyMembers) ? parsed.familyMembers : initialFamilyMembers,
      shopping: Array.isArray(parsed.shopping) ? parsed.shopping : initialShoppingList,
      renovation: Array.isArray(parsed.renovation) ? parsed.renovation : initialRenovationItems,
      vendors: Array.isArray(parsed.vendors) ? parsed.vendors : initialVendors,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Failed to read planner database file:", err);
    return {
      budget: initialBudgetItems,
      programme: initialProgramme,
      settings: initialEventSettings,
      familyMembers: initialFamilyMembers,
      shopping: initialShoppingList,
      renovation: initialRenovationItems,
      vendors: initialVendors,
      lastUpdated: new Date().toISOString(),
    };
  }
}

function saveLocalPlannerData(data: SharedPlannerData): void {
  ensurePlannerFile();
  try {
    fs.writeFileSync(PLANNER_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to planner database file:", err);
  }
}

export async function getPlannerData(): Promise<SharedPlannerData> {
  const sql = getDb();
  if (sql) {
    try {
      await ensureDbSchema();
      const rows = (await sql`SELECT key, data FROM planner_store;`) as {
        key: string;
        data: any;
      }[];

      if (rows && rows.length > 0) {
        const storeMap: Record<string, any> = {};
        for (const row of rows) {
          if (typeof row.data === "string") {
            try {
              storeMap[row.key] = JSON.parse(row.data);
            } catch {
              storeMap[row.key] = row.data;
            }
          } else {
            storeMap[row.key] = row.data;
          }
        }

        const fallback = getLocalPlannerData();
        const combined: SharedPlannerData = {
          budget: Array.isArray(storeMap.budget) ? storeMap.budget : fallback.budget,
          programme: Array.isArray(storeMap.programme) ? storeMap.programme : fallback.programme,
          settings: storeMap.settings ? { ...fallback.settings, ...storeMap.settings } : fallback.settings,
          familyMembers: Array.isArray(storeMap.familyMembers) ? storeMap.familyMembers : fallback.familyMembers,
          shopping: Array.isArray(storeMap.shopping) ? storeMap.shopping : fallback.shopping,
          renovation: Array.isArray(storeMap.renovation) ? storeMap.renovation : fallback.renovation,
          vendors: Array.isArray(storeMap.vendors) ? storeMap.vendors : fallback.vendors,
          lastUpdated: storeMap.lastUpdated || fallback.lastUpdated || new Date().toISOString(),
        };

        // Cache locally
        saveLocalPlannerData(combined);
        return combined;
      }
    } catch (err) {
      console.error("Failed to query Neon PostgreSQL for planner data, falling back to local file:", err);
    }
  }

  return getLocalPlannerData();
}

export async function updatePlannerData(key: string, data: unknown): Promise<SharedPlannerData> {
  const now = new Date().toISOString();
  const sql = getDb();

  if (sql) {
    try {
      await ensureDbSchema();
      const jsonVal = JSON.stringify(data);
      await sql`
        INSERT INTO planner_store (key, data, updated_at)
        VALUES (${key}, ${jsonVal}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = NOW();
      `;

      await sql`
        INSERT INTO planner_store (key, data, updated_at)
        VALUES ('lastUpdated', ${JSON.stringify(now)}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = NOW();
      `;
    } catch (err) {
      console.error(`Failed to persist key '${key}' to Neon PostgreSQL:`, err);
    }
  }

  // Update local file cache
  const current = getLocalPlannerData();
  const updated: SharedPlannerData = {
    ...current,
    [key]: data,
    lastUpdated: now,
  };
  saveLocalPlannerData(updated);

  return updated;
}
