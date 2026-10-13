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

export function getPlannerData(): SharedPlannerData {
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

export function updatePlannerData(key: string, data: unknown): SharedPlannerData {
  ensurePlannerFile();
  const current = getPlannerData();
  const updated: SharedPlannerData = {
    ...current,
    [key]: data,
    lastUpdated: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(PLANNER_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to planner database file:", err);
  }

  return updated;
}
