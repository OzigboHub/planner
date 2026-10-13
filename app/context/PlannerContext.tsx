"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  BudgetItem,
  Contribution,
  TaskItem,
  ShoppingItem,
  RenovationItem,
  VendorItem,
  ProgrammeActivity,
  EventDocument,
  FamilyDecision,
  GuestRSVP,
  CondolenceTribute,
  AuditLogEntry,
  EventSettings,
  UserRole,
  DashboardSection,
  FamilyMember,
  PermissionLevel,
} from "../types";
import {
  initialEventSettings,
  initialBudgetItems,
  initialContributions,
  initialTasks,
  initialShoppingList,
  initialRenovationItems,
  initialProgramme,
  initialVendors,
  initialDocuments,
  initialFamilyDecisions,
  initialRSVPs,
  initialCondolences,
  initialAuditLogs,
  initialFamilyMembers,
} from "../data/initialData";

interface PlannerContextType {
  // Navigation & Role
  currentView: "guest" | "family";
  setCurrentView: (view: "guest" | "family") => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  dashboardSection: DashboardSection;
  setDashboardSection: (sec: DashboardSection) => void;

  // Family Authentication & Permission Enforcement
  isFamilyAuthenticated: boolean;
  authenticatedMember: string | null;
  authenticatedMemberId: string | null;
  authenticatedPhone: string | null;
  userPermission: PermissionLevel;
  canEdit: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginFamily: (passcode: string, memberName?: string) => boolean;
  loginFamilyWithPhone: (phone: string, passcode: string) => boolean;
  logoutFamily: () => void;
  requestFamilyAccess: () => void;

  // Guest Invitation & Share Link Feature
  isInvitedGuest: boolean;
  setIsInvitedGuest: (invited: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  getInvitationUrl: () => string;

  // Onboarded Children & Family Members & Permission Management
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, "id" | "createdAt">) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  updateMemberPermission: (memberId: string, permission: PermissionLevel) => boolean;
  generateMemberCode: (name: string) => string;

  // State
  settings: EventSettings;
  updateSettings: (newSettings: Partial<EventSettings>) => void;
  budgetItems: BudgetItem[];
  contributions: Contribution[];
  tasks: TaskItem[];
  shoppingList: ShoppingItem[];
  renovationItems: RenovationItem[];
  programme: ProgrammeActivity[];
  vendors: VendorItem[];
  documents: EventDocument[];
  decisions: FamilyDecision[];
  rsvps: GuestRSVP[];
  condolences: CondolenceTribute[];
  auditLogs: AuditLogEntry[];

  // Computed Financials
  financialMetrics: {
    baseSubtotal: number;
    renovationAllowance: number;
    provisionalSubtotal: number;
    contingencyAmount: number;
    workingTotal: number;
    costPerGuest: number;
    totalAmountPaid: number;
    totalBalanceDue: number;
    totalPledged: number;
    totalReceived: number;
    outstandingPledges: number;
    fundingCoveragePercent: number;
    renovationTotalQuoted: number;
    renovationTotalPaid: number;
  };

  // Actions
  addBudgetItem: (item: Omit<BudgetItem, "id">) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  recordBudgetPayment: (id: string, amount: number) => void;
  deleteBudgetItem: (id: string) => void;
  toggleBudgetItemDone: (id: string) => boolean;

  addContribution: (contrib: Omit<Contribution, "id" | "dateLogged">) => void;
  updateContribution: (id: string, updates: Partial<Contribution>) => void;

  addTask: (task: Omit<TaskItem, "id">) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;

  addShoppingItem: (item: Omit<ShoppingItem, "id">) => void;
  updateShoppingItem: (id: string, updates: Partial<ShoppingItem>) => void;

  updateRenovationItem: (id: string, updates: Partial<RenovationItem>) => void;
  addRenovationItem: (item: Omit<RenovationItem, "id">) => void;

  updateProgrammeItem: (id: string, updates: Partial<ProgrammeActivity>) => void;
  addProgrammeItem: (item: Omit<ProgrammeActivity, "id">) => void;

  addVendor: (vendor: Omit<VendorItem, "id">) => void;
  updateVendor: (id: string, updates: Partial<VendorItem>) => void;

  addRSVP: (rsvp: Omit<GuestRSVP, "id" | "submittedAt">) => void;
  addCondolence: (tribute: Omit<CondolenceTribute, "id" | "submittedAt">) => void;

  updateDecision: (id: string, status: FamilyDecision["status"], notes?: string) => void;
  addDocument: (doc: Omit<EventDocument, "id" | "uploadDate">) => void;

  resetToDefaults: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const STORAGE_PREFIX = "akhabue_burial_planner_v5_";

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<"guest" | "family">("guest");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>("overview");

  // Family Authentication State
  const [isFamilyAuthenticated, setIsFamilyAuthenticated] = useState<boolean>(false);
  const [authenticatedMember, setAuthenticatedMember] = useState<string | null>(null);
  const [authenticatedMemberId, setAuthenticatedMemberId] = useState<string | null>(null);
  const [authenticatedPhone, setAuthenticatedPhone] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<EventSettings>(initialEventSettings);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);
  const [contributions, setContributions] = useState<Contribution[]>(initialContributions);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(initialShoppingList);
  const [renovationItems, setRenovationItems] = useState<RenovationItem[]>(initialRenovationItems);
  const [programme, setProgramme] = useState<ProgrammeActivity[]>(initialProgramme);
  const [vendors, setVendors] = useState<VendorItem[]>(initialVendors);
  const [documents, setDocuments] = useState<EventDocument[]>(initialDocuments);
  const [decisions, setDecisions] = useState<FamilyDecision[]>(initialFamilyDecisions);
  const [rsvps, setRsvps] = useState<GuestRSVP[]>(initialRSVPs);
  const [condolences, setCondolences] = useState<CondolenceTribute[]>(initialCondolences);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [isInvitedGuest, setIsInvitedGuest] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      // Purge legacy storage caches with dummy non-zero amounts
      ["v1_", "v2_", "v3_", "v4_"].forEach((ver) => {
        try {
          localStorage.removeItem(`akhabue_burial_planner_${ver}budget`);
          localStorage.removeItem(`akhabue_burial_planner_${ver}contributions`);
          localStorage.removeItem(`akhabue_burial_planner_${ver}tasks`);
          localStorage.removeItem(`akhabue_burial_planner_${ver}shopping`);
          localStorage.removeItem(`akhabue_burial_planner_${ver}renovation`);
        } catch {}
      });

      const savedMembers = localStorage.getItem(STORAGE_PREFIX + "members");
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        const needsRefresh =
          !Array.isArray(parsed) ||
          !parsed.some((m: FamilyMember) => m.loginCode === "261001") ||
          !parsed.some((m: FamilyMember) => m.loginCode === "261030") ||
          !parsed.some((m: FamilyMember) => m.loginCode === "261008") ||
          !parsed.some((m: FamilyMember) => m.loginCode === "261009");
        if (needsRefresh) {
          setFamilyMembers(initialFamilyMembers);
          localStorage.setItem(STORAGE_PREFIX + "members", JSON.stringify(initialFamilyMembers));
        } else {
          setFamilyMembers(parsed);
        }
      }

      const savedSettings = localStorage.getItem(STORAGE_PREFIX + "settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          ...initialEventSettings,
          ...parsed,
          honoree: "Late Mr. Festus Okoruwa Akhabue",
          honoreeAge: 74,
          vigilDate: "2026-10-29",
        });
      }

      const savedBudget = localStorage.getItem(STORAGE_PREFIX + "budget");
      if (savedBudget) {
        const parsed = JSON.parse(savedBudget);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBudgetItems(parsed);
        } else {
          setBudgetItems(initialBudgetItems);
        }
      } else {
        setBudgetItems(initialBudgetItems);
      }

      // Contributions and Tasks removed
      setContributions([]);
      setTasks([]);

      const savedShopping = localStorage.getItem(STORAGE_PREFIX + "shopping");
      if (savedShopping) setShoppingList(JSON.parse(savedShopping));

      const savedReno = localStorage.getItem(STORAGE_PREFIX + "renovation");
      if (savedReno) setRenovationItems(JSON.parse(savedReno));

      const savedProg = localStorage.getItem(STORAGE_PREFIX + "programme");
      if (savedProg) {
        const parsed = JSON.parse(savedProg);
        const hasVigil =
          Array.isArray(parsed) &&
          parsed.some((p: ProgrammeActivity) => p.activity.toLowerCase().includes("vigil"));
        const hasArrival =
          Array.isArray(parsed) &&
          parsed.some((p: ProgrammeActivity) => p.time === "10:00 AM" && p.activity.toLowerCase().includes("arrival"));
        if (!hasVigil || !hasArrival) {
          setProgramme(initialProgramme);
          localStorage.setItem(STORAGE_PREFIX + "programme", JSON.stringify(initialProgramme));
        } else {
          setProgramme(parsed);
        }
      }

      const savedVendors = localStorage.getItem(STORAGE_PREFIX + "vendors");
      if (savedVendors) setVendors(JSON.parse(savedVendors));

      const savedDecisions = localStorage.getItem(STORAGE_PREFIX + "decisions");
      if (savedDecisions) setDecisions(JSON.parse(savedDecisions));

      const savedRsvps = localStorage.getItem(STORAGE_PREFIX + "rsvps");
      if (savedRsvps) setRsvps(JSON.parse(savedRsvps));

      const savedCond = localStorage.getItem(STORAGE_PREFIX + "condolences");
      if (savedCond) setCondolences(JSON.parse(savedCond));

      // Check session storage for family login
      const savedAuth = sessionStorage.getItem("akhabue_family_auth");
      const savedMember = sessionStorage.getItem("akhabue_family_member");
      const savedMemberId = sessionStorage.getItem("akhabue_family_member_id");
      const savedPhone = sessionStorage.getItem("akhabue_family_member_phone");
      const savedRole = sessionStorage.getItem("akhabue_family_role") as UserRole | null;
      if (savedAuth === "true") {
        setIsFamilyAuthenticated(true);
        setAuthenticatedMember(savedMember || "Family Member");
        if (savedMemberId) setAuthenticatedMemberId(savedMemberId);
        if (savedPhone) setAuthenticatedPhone(savedPhone);
        if (savedRole) setUserRole(savedRole);
        setCurrentView("family");
      }

      // Check if viewing via invitation link
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        if (
          urlParams.get("invited") === "true" ||
          urlParams.get("guest") === "true" ||
          window.location.pathname.startsWith("/invite")
        ) {
          setIsInvitedGuest(true);
        }
      }
    } catch {
      // ignore parse error and keep initial state
    }
  }, []);

  const lastSavedTimestampRef = useRef<number>(0);

  // Synchronize state with central server so changes reflect across all children's devices
  const syncWithServer = useCallback(async () => {
    // If admin saved locally in the last 6 seconds, prevent polling from overwriting fresh local input
    if (Date.now() - lastSavedTimestampRef.current < 6000) {
      return;
    }
    try {
      const res = await fetch("/api/planner", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;

        // Check if server already has populated items or if local has admin modifications
        const serverHasData =
          Array.isArray(d.budget) &&
          d.budget.some(
            (b: BudgetItem) =>
              (b.quotedAmount || 0) > 0 ||
              (b.actualCost || 0) > 0 ||
              (b.amountPaid || 0) > 0 ||
              b.name === "D J" ||
              b.isDone === true
          );

        const localSaved = localStorage.getItem(STORAGE_PREFIX + "budget");
        let localHasData = false;
        let localItems: BudgetItem[] = [];
        if (localSaved) {
          try {
            localItems = JSON.parse(localSaved);
            localHasData =
              Array.isArray(localItems) &&
              localItems.some(
                (b: BudgetItem) =>
                  (b.quotedAmount || 0) > 0 ||
                  (b.actualCost || 0) > 0 ||
                  (b.amountPaid || 0) > 0 ||
                  b.name === "D J" ||
                  b.isDone === true
              );
          } catch {}
        }

        if (!serverHasData && localHasData) {
          // Push existing local admin changes up to server so all devices get them immediately!
          await fetch("/api/planner", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: "budget", data: localItems }),
          });
          setBudgetItems(localItems);
        } else if (Array.isArray(d.budget) && d.budget.length > 0) {
          setBudgetItems(d.budget);
          localStorage.setItem(STORAGE_PREFIX + "budget", JSON.stringify(d.budget));
        }

        if (Array.isArray(d.programme) && d.programme.length > 0) {
          setProgramme(d.programme);
          localStorage.setItem(STORAGE_PREFIX + "programme", JSON.stringify(d.programme));
        }

        if (d.settings) {
          setSettings((prev) => ({ ...prev, ...d.settings }));
          localStorage.setItem(STORAGE_PREFIX + "settings", JSON.stringify(d.settings));
        }

        if (Array.isArray(d.familyMembers) && d.familyMembers.length > 0) {
          setFamilyMembers(d.familyMembers);
          localStorage.setItem(STORAGE_PREFIX + "members", JSON.stringify(d.familyMembers));
        }

        if (Array.isArray(d.shopping)) {
          setShoppingList(d.shopping);
        }

        if (Array.isArray(d.renovation)) {
          setRenovationItems(d.renovation);
        }

        if (Array.isArray(d.vendors)) {
          setVendors(d.vendors);
        }
      }
    } catch {
      // offline fallback
    }
  }, []);

  useEffect(() => {
    // Initial fetch from server
    syncWithServer();

    // Re-sync when tab gains focus
    const handleFocus = () => {
      syncWithServer();
    };
    window.addEventListener("focus", handleFocus);

    // Auto-sync polling every 5 seconds so changes reflect across devices in real-time
    const pollInterval = setInterval(() => {
      syncWithServer();
    }, 5000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(pollInterval);
    };
  }, [syncWithServer]);

  const getInvitationUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/invite`;
    }
    return "http://localhost:3005/invite";
  };

  // Save changes locally and immediately broadcast to shared server
  const saveState = (key: string, data: unknown) => {
    lastSavedTimestampRef.current = Date.now();
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch {
      // storage quota or error
    }

    // Send immediately to central server so all other devices reflect the change
    fetch("/api/planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data }),
    }).catch((err) => {
      console.warn("Failed to sync change to server:", err);
    });
  };

  const addAudit = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: userRole === "admin" ? "Family Admin" : userRole === "sibling" ? "Sibling Member" : "Guest",
      action,
      details,
    };
    setAuditLogs((prev) => {
      const next = [entry, ...prev];
      saveState("audit", next);
      return next;
    });
  };

  // Financial Metrics calculations
  const baseItems = budgetItems.filter((i) => i.category !== "Family Residence Renovation");
  const baseSubtotal = baseItems.reduce((acc, curr) => acc + curr.provisionalAllowance, 0);
  const renovationAllowance = settings.renovationCap;
  const provisionalSubtotal = baseSubtotal + renovationAllowance;
  const contingencyAmount = Math.round(provisionalSubtotal * settings.contingencyRate);
  const workingTotal = provisionalSubtotal + contingencyAmount;
  const costPerGuest = Math.round(workingTotal / (settings.expectedGuests || 500));

  const totalAmountPaid = budgetItems.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalActualOrAllowance = budgetItems.reduce(
    (acc, curr) => acc + (curr.actualCost ?? curr.quotedAmount ?? curr.provisionalAllowance),
    0
  );
  const totalBalanceDue = Math.max(0, totalActualOrAllowance - totalAmountPaid);

  const totalPledged = contributions.reduce((acc, curr) => acc + curr.promisedAmount, 0);
  const totalReceived = contributions.reduce(
    (acc, curr) => acc + curr.receivedAmount + curr.directPurchasesAmount,
    0
  );
  const outstandingPledges = Math.max(0, totalPledged - totalReceived);
  const fundingCoveragePercent = workingTotal > 0 ? Math.min(100, Math.round((totalReceived / workingTotal) * 100)) : 0;

  const renovationTotalQuoted = renovationItems.reduce((acc, curr) => acc + curr.quotedAmount, 0);
  const renovationTotalPaid = renovationItems.reduce((acc, curr) => acc + curr.paidAmount, 0);

  const financialMetrics = {
    baseSubtotal,
    renovationAllowance,
    provisionalSubtotal,
    contingencyAmount,
    workingTotal,
    costPerGuest,
    totalAmountPaid,
    totalBalanceDue,
    totalPledged,
    totalReceived,
    outstandingPledges,
    fundingCoveragePercent,
    renovationTotalQuoted,
    renovationTotalPaid,
  };

  // Active member and permissions evaluation
  const activeMemberObj = familyMembers.find(
    (m) =>
      (authenticatedMemberId && m.id === authenticatedMemberId) ||
      m.name === authenticatedMember
  );

  const isAdmin = userRole === "admin";
  const userPermission: PermissionLevel = isAdmin
    ? "view_and_edit"
    : "view_only";

  const canEdit = isFamilyAuthenticated && isAdmin;

  // Server/Context permission guards
  const guardEditPermission = (operation: string): boolean => {
    if (!isFamilyAuthenticated) {
      console.warn(`[Blocked] Unauthenticated attempt: ${operation}`);
      return false;
    }
    if (!canEdit) {
      console.warn(
        `[Permission Denied] ${authenticatedMember || "User"} is in View-Only mode. Blocked action: ${operation}`
      );
      addAudit(
        "Permission Denied",
        `Blocked modification (${operation}) by view-only user: ${authenticatedMember || "Unknown"}`
      );
      return false;
    }
    return true;
  };

  const guardAdminPermission = (operation: string): boolean => {
    if (userRole !== "admin") {
      console.warn(`[Admin Denied] Non-admin attempted: ${operation}`);
      addAudit(
        "Admin Access Denied",
        `${authenticatedMember || "User"} attempted admin action: ${operation}`
      );
      return false;
    }
    return true;
  };

  // Actions
  const updateSettings = (newSettings: Partial<EventSettings>) => {
    if (!guardEditPermission("updateSettings")) return;
    setSettings((prev) => {
      const next = { ...prev, ...newSettings };
      saveState("settings", next);
      return next;
    });
    addAudit("Settings Updated", "Updated event settings configuration");
  };

  const addBudgetItem = (item: Omit<BudgetItem, "id">) => {
    if (!guardEditPermission("addBudgetItem")) return;
    const newItem: BudgetItem = {
      ...item,
      id: "b-" + Date.now(),
    };
    setBudgetItems((prev) => {
      const next = [...prev, newItem];
      saveState("budget", next);
      return next;
    });
    addAudit("Budget Item Added", `Added line item: ${newItem.name}`);
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    if (!guardEditPermission("updateBudgetItem")) return;
    setBudgetItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      saveState("budget", next);
      return next;
    });
    addAudit("Budget Item Updated", `Updated item ${id}`);
  };

  const recordBudgetPayment = (id: string, amount: number) => {
    if (!guardEditPermission("recordBudgetPayment")) return;
    setBudgetItems((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          const newPaid = (item.amountPaid || 0) + amount;
          const cost = item.actualCost ?? item.quotedAmount ?? item.provisionalAllowance;
          const paidStatus: BudgetItem["paidStatus"] =
            newPaid >= cost ? "Paid" : newPaid > 0 ? "Partial" : "Unpaid";
          return { ...item, amountPaid: newPaid, paidStatus };
        }
        return item;
      });
      saveState("budget", next);
      return next;
    });
    addAudit("Payment Recorded", `Logged payment of ₦${amount.toLocaleString()} on item ${id}`);
  };

  const deleteBudgetItem = (id: string) => {
    if (!guardEditPermission("deleteBudgetItem")) return;
    setBudgetItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveState("budget", next);
      return next;
    });
    addAudit("Budget Item Deleted", `Removed item ${id}`);
  };

  const toggleBudgetItemDone = (id: string): boolean => {
    if (!isAdmin && !canEdit) {
      alert("Only authorized committee coordinators can tick what has been done and what is left.");
      return false;
    }
    setBudgetItems((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          const wasDone = item.isDone !== undefined ? item.isDone : item.paidStatus === "Paid";
          const newDone = !wasDone;
          return {
            ...item,
            isDone: newDone,
            paidStatus: (newDone ? "Paid" : item.amountPaid > 0 ? "Partial" : "Unpaid") as BudgetItem["paidStatus"],
          };
        }
        return item;
      });
      saveState("budget", next);
      return next;
    });
    addAudit("Item Status Toggled", `Toggled done/left status for item ${id}`);
    return true;
  };

  const addContribution = (contrib: Omit<Contribution, "id" | "dateLogged">) => {
    if (!guardEditPermission("addContribution")) return;
    const newContrib: Contribution = {
      ...contrib,
      id: "c-" + Date.now(),
      dateLogged: new Date().toISOString().substring(0, 10),
    };
    setContributions((prev) => {
      const next = [...prev, newContrib];
      saveState("contributions", next);
      return next;
    });
    const memberName = familyMembers.find((m) => m.id === newContrib.memberId)?.name || newContrib.notes || "Family Member";
    addAudit("Contribution Logged", `Logged contribution for ${memberName}`);
  };

  const updateContribution = (id: string, updates: Partial<Contribution>) => {
    if (!guardEditPermission("updateContribution")) return;
    setContributions((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveState("contributions", next);
      return next;
    });
    addAudit("Contribution Updated", `Updated record for contribution ${id}`);
  };

  const addTask = (task: Omit<TaskItem, "id">) => {
    if (!guardEditPermission("addTask")) return;
    const newTask: TaskItem = { ...task, id: "t-" + Date.now() };
    setTasks((prev) => {
      const next = [...prev, newTask];
      saveState("tasks", next);
      return next;
    });
    addAudit("Task Created", `Added task: ${newTask.title}`);
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    if (!guardEditPermission("updateTask")) return;
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveState("tasks", next);
      return next;
    });
    addAudit("Task Updated", `Updated task ${id}`);
  };

  const deleteTask = (id: string) => {
    if (!guardEditPermission("deleteTask")) return;
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveState("tasks", next);
      return next;
    });
    addAudit("Task Removed", `Deleted task ${id}`);
  };

  const addShoppingItem = (item: Omit<ShoppingItem, "id">) => {
    if (!guardEditPermission("addShoppingItem")) return;
    const newItem: ShoppingItem = { ...item, id: "s-" + Date.now() };
    setShoppingList((prev) => {
      const next = [...prev, newItem];
      saveState("shopping", next);
      return next;
    });
    addAudit("Shopping Item Added", `Added item: ${newItem.item}`);
  };

  const updateShoppingItem = (id: string, updates: Partial<ShoppingItem>) => {
    if (!guardEditPermission("updateShoppingItem")) return;
    setShoppingList((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveState("shopping", next);
      return next;
    });
  };

  const updateRenovationItem = (id: string, updates: Partial<RenovationItem>) => {
    if (!guardEditPermission("updateRenovationItem")) return;
    setRenovationItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      saveState("renovation", next);
      return next;
    });
    addAudit("Renovation Item Updated", `Updated repair item ${id}`);
  };

  const addRenovationItem = (item: Omit<RenovationItem, "id">) => {
    if (!guardEditPermission("addRenovationItem")) return;
    const newItem: RenovationItem = { ...item, id: "r-" + Date.now() };
    setRenovationItems((prev) => {
      const next = [...prev, newItem];
      saveState("renovation", next);
      return next;
    });
    addAudit("Renovation Item Added", `Added repair item: ${newItem.item}`);
  };

  const updateProgrammeItem = (id: string, updates: Partial<ProgrammeActivity>) => {
    if (!guardEditPermission("updateProgrammeItem")) return;
    setProgramme((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveState("programme", next);
      return next;
    });
    addAudit("Programme Updated", `Updated programme schedule: ${id}`);
  };

  const addProgrammeItem = (item: Omit<ProgrammeActivity, "id">) => {
    if (!guardEditPermission("addProgrammeItem")) return;
    const newItem: ProgrammeActivity = { ...item, id: "p-" + Date.now() };
    setProgramme((prev) => {
      const next = [...prev, newItem].sort((a, b) => a.order - b.order);
      saveState("programme", next);
      return next;
    });
  };

  const addVendor = (vendor: Omit<VendorItem, "id">) => {
    if (!guardEditPermission("addVendor")) return;
    const newVendor: VendorItem = { ...vendor, id: "v-" + Date.now() };
    setVendors((prev) => {
      const next = [...prev, newVendor];
      saveState("vendors", next);
      return next;
    });
    addAudit("Vendor Added", `Registered vendor: ${newVendor.vendorName}`);
  };

  const updateVendor = (id: string, updates: Partial<VendorItem>) => {
    if (!guardEditPermission("updateVendor")) return;
    setVendors((prev) => {
      const next = prev.map((v) => (v.id === id ? { ...v, ...updates } : v));
      saveState("vendors", next);
      return next;
    });
  };

  const addRSVP = (rsvp: Omit<GuestRSVP, "id" | "submittedAt">) => {
    const newRsvp: GuestRSVP = {
      ...rsvp,
      id: "rsvp-" + Date.now(),
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setRsvps((prev) => {
      const next = [newRsvp, ...prev];
      saveState("rsvps", next);
      return next;
    });
    addAudit("Guest RSVP Received", `RSVP from ${newRsvp.guestName} (${newRsvp.partySize} guests)`);
  };

  const addCondolence = (tribute: Omit<CondolenceTribute, "id" | "submittedAt">) => {
    const newTribute: CondolenceTribute = {
      ...tribute,
      id: "cond-" + Date.now(),
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setCondolences((prev) => {
      const next = [newTribute, ...prev];
      saveState("condolences", next);
      return next;
    });
    addAudit("Condolence Posted", `Tribute from ${newTribute.authorName}`);
  };

  const updateDecision = (id: string, status: FamilyDecision["status"], notes?: string) => {
    if (!guardEditPermission("updateDecision")) return;
    setDecisions((prev) => {
      const next = prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              notes: notes ?? d.notes,
              approvedBy: userRole === "admin" ? "Family Council / Admin" : d.approvedBy,
              dateDecided: new Date().toISOString().substring(0, 10),
            }
          : d
      );
      saveState("decisions", next);
      return next;
    });
    addAudit("Family Decision Updated", `Decision ${id} marked as ${status}`);
  };

  const addDocument = (doc: Omit<EventDocument, "id" | "uploadDate">) => {
    if (!guardEditPermission("addDocument")) return;
    const newDoc: EventDocument = {
      ...doc,
      id: "doc-" + Date.now(),
      uploadDate: new Date().toISOString().substring(0, 10),
    };
    setDocuments((prev) => {
      const next = [newDoc, ...prev];
      saveState("documents", next);
      return next;
    });
    addAudit("Document Uploaded", `Added file: ${newDoc.title}`);
  };

  const generateMemberCode = (_name?: string): string => {
    // Generate secure 6-digit numerical PIN (100000 - 999999)
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const updateMemberPermission = (memberId: string, permission: PermissionLevel): boolean => {
    if (!guardAdminPermission("updateMemberPermission")) return false;

    const target = familyMembers.find((m) => m.id === memberId);
    if (!target) return false;

    setFamilyMembers((prev) => {
      const next = prev.map((m) => (m.id === memberId ? { ...m, permission } : m));
      saveState("members", next);
      return next;
    });

    addAudit(
      "Permission Updated",
      `Admin changed ${target.name}'s permission to ${permission === "view_and_edit" ? "View & Edit" : "View Only"}`
    );
    return true;
  };

  const addFamilyMember = (member: Omit<FamilyMember, "id" | "createdAt">) => {
    const newMember: FamilyMember = {
      ...member,
      permission: member.permission || "view_only", // Default permission for every child is View Only
      id: "m-" + Date.now(),
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setFamilyMembers((prev) => {
      const filtered = prev.filter(
        (m) =>
          m.name.toLowerCase() !== newMember.name.toLowerCase() &&
          m.loginCode.toUpperCase() !== newMember.loginCode.toUpperCase()
      );
      const next = [newMember, ...filtered];
      saveState("members", next);
      return next;
    });
    addAudit(
      "Child Onboarded",
      `Onboarded ${newMember.name} with login code: ${newMember.loginCode} (Permission: ${newMember.permission})`
    );
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      saveState("members", next);
      return next;
    });
    addAudit("Member Updated", `Updated member profile / login code for ID ${id}`);
  };

  const deleteFamilyMember = (id: string) => {
    const target = familyMembers.find((m) => m.id === id);
    setFamilyMembers((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveState("members", next);
      return next;
    });
    addAudit(
      "Member Removed",
      `Removed ${target ? target.name : id} from members list`
    );
  };

  const loginFamilyWithPhone = (phoneInput: string, passcode: string): boolean => {
    const normalizeDigits = (str: string) => {
      let d = str.replace(/[^0-9]/g, "");
      if (d.startsWith("234") && d.length > 10) d = d.slice(3);
      if (d.startsWith("233") && d.length > 9) d = d.slice(3);
      if (d.startsWith("0")) d = d.replace(/^0+/, "");
      return d;
    };

    const cleanInputDigits = normalizeDigits(phoneInput);
    const rawCleanDigits = phoneInput.replace(/[^0-9]/g, "");
    const cleanCode = passcode.trim().toUpperCase();

    if (!cleanCode) return false;

    // Search candidates in active members and fallback to initial roster
    const allCandidates = [...familyMembers];
    for (const initM of initialFamilyMembers) {
      if (!allCandidates.some((c) => c.id === initM.id)) {
        allCandidates.push(initM);
      }
    }

    const matched = allCandidates.find((m) => {
      const memberClean = normalizeDigits(m.phone || "");
      const memberRaw = (m.phone || "").replace(/[^0-9]/g, "");
      if (!memberClean && !memberRaw) return false;
      const phoneMatches =
        memberClean === cleanInputDigits ||
        memberRaw.endsWith(rawCleanDigits) ||
        rawCleanDigits.endsWith(memberRaw) ||
        (rawCleanDigits.length >= 7 && memberRaw.slice(-7) === rawCleanDigits.slice(-7));
      const codeMatches =
        m.loginCode.trim().toUpperCase() === cleanCode ||
        (m.loginCode === "261001" && cleanCode === "UWADE-2026") ||
        (m.loginCode === "261030" && cleanCode === "ADMIN-2026");
      return phoneMatches && codeMatches;
    });

    if (matched) {
      setIsFamilyAuthenticated(true);
      setAuthenticatedMember(matched.name);
      setAuthenticatedMemberId(matched.id);
      setAuthenticatedPhone(matched.phone || phoneInput);

      const isExecutive =
        matched.assignedRole?.includes("Executive") ||
        matched.loginCode === "261030" ||
        matched.loginCode === "ADMIN-2026";
      setUserRole(isExecutive ? "admin" : "sibling");

      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
      updateFamilyMember(matched.id, { lastLogin: nowStr });

      try {
        sessionStorage.setItem("akhabue_family_auth", "true");
        sessionStorage.setItem("akhabue_family_member", matched.name);
        sessionStorage.setItem("akhabue_family_member_id", matched.id);
        sessionStorage.setItem("akhabue_family_member_phone", matched.phone || phoneInput);
        sessionStorage.setItem("akhabue_family_role", isExecutive ? "admin" : "sibling");
        sessionStorage.setItem("akhabue_current_view", "family");
      } catch {}

      setCurrentView("family");
      setIsAuthModalOpen(false);
      addAudit(
        "Phone Login Verified",
        `${matched.name} logged in with phone (${matched.phone || phoneInput}) and code. Permission: ${matched.permission || "view_only"}`
      );
      return true;
    }

    // Admin bypass also supported with phone input if master code
    if (
      cleanCode === "261030" ||
      cleanCode === "261000" ||
      cleanCode === "AKHABUE2026" ||
      cleanCode === "2026" ||
      cleanCode === "ADMIN-2026"
    ) {
      setIsFamilyAuthenticated(true);
      setAuthenticatedMember("Family Committee Admin");
      setAuthenticatedMemberId("m-07");
      setUserRole("admin");
      try {
        sessionStorage.setItem("akhabue_family_auth", "true");
        sessionStorage.setItem("akhabue_family_member", "Family Committee Admin");
        sessionStorage.setItem("akhabue_family_member_id", "m-07");
        sessionStorage.setItem("akhabue_family_role", "admin");
      } catch {}
      setCurrentView("family");
      setIsAuthModalOpen(false);
      addAudit(
        "Admin Master Login",
        `Admin logged in via bypass code (${cleanCode})`
      );
      return true;
    }

    return false;
  };

  const loginFamily = (passcode: string, memberName?: string): boolean => {
    const clean = passcode.trim().toUpperCase();
    if (!clean) return false;

    // 1. Direct match with a member's personalized loginCode
    const allCandidates = [...familyMembers];
    for (const initM of initialFamilyMembers) {
      if (!allCandidates.some((c) => c.id === initM.id)) {
        allCandidates.push(initM);
      }
    }

    const matchedMember = allCandidates.find(
      (m) =>
        m.loginCode.trim().toUpperCase() === clean ||
        (m.loginCode === "261001" && clean === "UWADE-2026") ||
        (m.loginCode === "261030" && clean === "ADMIN-2026")
    );

    if (matchedMember) {
      const activeName =
        memberName && memberName !== "AUTO" ? memberName : matchedMember.name;
      setIsFamilyAuthenticated(true);
      setAuthenticatedMember(activeName);
      setAuthenticatedMemberId(matchedMember.id);
      setAuthenticatedPhone(matchedMember.phone || null);

      const isExecutive =
        matchedMember.assignedRole?.includes("Executive") ||
        matchedMember.loginCode === "261030" ||
        matchedMember.loginCode === "ADMIN-2026";
      setUserRole(isExecutive ? "admin" : "sibling");

      // Record last login time
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
      updateFamilyMember(matchedMember.id, { lastLogin: nowStr });

      try {
        sessionStorage.setItem("akhabue_family_auth", "true");
        sessionStorage.setItem("akhabue_family_member", activeName);
        sessionStorage.setItem("akhabue_family_member_id", matchedMember.id);
        sessionStorage.setItem("akhabue_family_role", isExecutive ? "admin" : "sibling");
        sessionStorage.setItem("akhabue_current_view", "family");
      } catch {}
      setCurrentView("family");
      setIsAuthModalOpen(false);
      addAudit(
        "Child Login Verified",
        `${activeName} logged in with assigned code (${clean}). Permission: ${matchedMember.permission || "view_only"}`
      );
      return true;
    }

    // 2. Master passcodes for Admin & Committee emergency access
    if (
      clean === "261030" ||
      clean === "261000" ||
      clean === "AKHABUE2026" ||
      clean === "2026" ||
      clean === "AKHABUE" ||
      clean === "1234" ||
      clean === "ADMIN-2026"
    ) {
      const activeName = memberName || "Family Committee Admin";
      setIsFamilyAuthenticated(true);
      setAuthenticatedMember(activeName);
      setAuthenticatedMemberId("m-07");
      setUserRole("admin");
      try {
        sessionStorage.setItem("akhabue_family_auth", "true");
        sessionStorage.setItem("akhabue_family_member", activeName);
        sessionStorage.setItem("akhabue_family_member_id", "m-07");
        sessionStorage.setItem("akhabue_family_role", "admin");
      } catch {}
      setCurrentView("family");
      setIsAuthModalOpen(false);
      addAudit(
        "Admin / Committee Login",
        `${activeName} logged in with master bypass code`
      );
      return true;
    }

    return false;
  };

  const logoutFamily = () => {
    setIsFamilyAuthenticated(false);
    setAuthenticatedMember(null);
    setAuthenticatedMemberId(null);
    setAuthenticatedPhone(null);
    setUserRole("sibling");
    try {
      sessionStorage.removeItem("akhabue_family_auth");
      sessionStorage.removeItem("akhabue_family_member");
      sessionStorage.removeItem("akhabue_family_member_id");
      sessionStorage.removeItem("akhabue_family_member_phone");
      sessionStorage.removeItem("akhabue_family_role");
    } catch {}
    setCurrentView("guest");
    addAudit("Family Member Logout", "Session locked and returned to guest view");
  };

  const requestFamilyAccess = () => {
    if (isFamilyAuthenticated) {
      setCurrentView("family");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const resetToDefaults = () => {
    setSettings(initialEventSettings);
    setBudgetItems(initialBudgetItems);
    setContributions(initialContributions);
    setTasks(initialTasks);
    setShoppingList(initialShoppingList);
    setRenovationItems(initialRenovationItems);
    setProgramme(initialProgramme);
    setVendors(initialVendors);
    setDocuments(initialDocuments);
    setDecisions(initialFamilyDecisions);
    setRsvps(initialRSVPs);
    setCondolences(initialCondolences);
    setAuditLogs(initialAuditLogs);
    setFamilyMembers(initialFamilyMembers);

    localStorage.clear();
    addAudit("Data Reset", "Reset entire planner state to initial proposal data");
  };

  return (
    <PlannerContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        dashboardSection,
        setDashboardSection,
        isFamilyAuthenticated,
        authenticatedMember,
        authenticatedMemberId,
        authenticatedPhone,
        userPermission,
        canEdit,
        isAdmin,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginFamily,
        loginFamilyWithPhone,
        logoutFamily,
        requestFamilyAccess,
        isInvitedGuest,
        setIsInvitedGuest,
        isShareModalOpen,
        setIsShareModalOpen,
        getInvitationUrl,
        familyMembers,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        updateMemberPermission,
        generateMemberCode,
        settings,
        updateSettings,
        budgetItems,
        contributions,
        tasks,
        shoppingList,
        renovationItems,
        programme,
        vendors,
        documents,
        decisions,
        rsvps,
        condolences,
        auditLogs,
        financialMetrics,
        addBudgetItem,
        updateBudgetItem,
        recordBudgetPayment,
        deleteBudgetItem,
        toggleBudgetItemDone,
        addContribution,
        updateContribution,
        addTask,
        updateTask,
        deleteTask,
        addShoppingItem,
        updateShoppingItem,
        updateRenovationItem,
        addRenovationItem,
        updateProgrammeItem,
        addProgrammeItem,
        addVendor,
        updateVendor,
        addRSVP,
        addCondolence,
        updateDecision,
        addDocument,
        resetToDefaults,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlanner must be used within a PlannerProvider");
  }
  return context;
};
