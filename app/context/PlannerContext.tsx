"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
} from "../data/initialData";

interface PlannerContextType {
  // Navigation & Role
  currentView: "guest" | "family";
  setCurrentView: (view: "guest" | "family") => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  dashboardSection: DashboardSection;
  setDashboardSection: (sec: DashboardSection) => void;

  // Family Authentication (Private Session Gate)
  isFamilyAuthenticated: boolean;
  authenticatedMember: string | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginFamily: (passcode: string, memberName: string) => boolean;
  logoutFamily: () => void;
  requestFamilyAccess: () => void;

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

const STORAGE_PREFIX = "akhabue_burial_planner_v3_";

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<"guest" | "family">("guest");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>("overview");

  // Family Authentication State
  const [isFamilyAuthenticated, setIsFamilyAuthenticated] = useState<boolean>(false);
  const [authenticatedMember, setAuthenticatedMember] = useState<string | null>(null);
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

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_PREFIX + "settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedBudget = localStorage.getItem(STORAGE_PREFIX + "budget");
      if (savedBudget) setBudgetItems(JSON.parse(savedBudget));

      const savedContrib = localStorage.getItem(STORAGE_PREFIX + "contributions");
      if (savedContrib) setContributions(JSON.parse(savedContrib));

      const savedTasks = localStorage.getItem(STORAGE_PREFIX + "tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedShopping = localStorage.getItem(STORAGE_PREFIX + "shopping");
      if (savedShopping) setShoppingList(JSON.parse(savedShopping));

      const savedReno = localStorage.getItem(STORAGE_PREFIX + "renovation");
      if (savedReno) setRenovationItems(JSON.parse(savedReno));

      const savedProg = localStorage.getItem(STORAGE_PREFIX + "programme");
      if (savedProg) setProgramme(JSON.parse(savedProg));

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
      if (savedAuth === "true") {
        setIsFamilyAuthenticated(true);
        setAuthenticatedMember(savedMember || "Family Member");
      }
    } catch {
      // ignore parse error and keep initial state
    }
  }, []);

  // Save changes
  const saveState = (key: string, data: unknown) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch {
      // storage quota or error
    }
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

  // Actions
  const updateSettings = (newSettings: Partial<EventSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...newSettings };
      saveState("settings", next);
      return next;
    });
    addAudit("Settings Updated", "Updated event settings configuration");
  };

  const addBudgetItem = (item: Omit<BudgetItem, "id">) => {
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
    setBudgetItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      saveState("budget", next);
      return next;
    });
    addAudit("Budget Item Updated", `Updated item ${id}`);
  };

  const recordBudgetPayment = (id: string, amount: number) => {
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
    setBudgetItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveState("budget", next);
      return next;
    });
    addAudit("Budget Item Deleted", `Removed item ${id}`);
  };

  const addContribution = (contrib: Omit<Contribution, "id" | "dateLogged">) => {
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
    addAudit("Contribution Logged", `Logged contribution for ${newContrib.contributorName}`);
  };

  const updateContribution = (id: string, updates: Partial<Contribution>) => {
    setContributions((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveState("contributions", next);
      return next;
    });
    addAudit("Contribution Updated", `Updated record for contribution ${id}`);
  };

  const addTask = (task: Omit<TaskItem, "id">) => {
    const newTask: TaskItem = { ...task, id: "t-" + Date.now() };
    setTasks((prev) => {
      const next = [...prev, newTask];
      saveState("tasks", next);
      return next;
    });
    addAudit("Task Created", `Added task: ${newTask.title}`);
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveState("tasks", next);
      return next;
    });
    addAudit("Task Updated", `Updated task ${id}`);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveState("tasks", next);
      return next;
    });
    addAudit("Task Removed", `Deleted task ${id}`);
  };

  const addShoppingItem = (item: Omit<ShoppingItem, "id">) => {
    const newItem: ShoppingItem = { ...item, id: "s-" + Date.now() };
    setShoppingList((prev) => {
      const next = [...prev, newItem];
      saveState("shopping", next);
      return next;
    });
    addAudit("Shopping Item Added", `Added item: ${newItem.item}`);
  };

  const updateShoppingItem = (id: string, updates: Partial<ShoppingItem>) => {
    setShoppingList((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveState("shopping", next);
      return next;
    });
  };

  const updateRenovationItem = (id: string, updates: Partial<RenovationItem>) => {
    setRenovationItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      saveState("renovation", next);
      return next;
    });
    addAudit("Renovation Item Updated", `Updated repair item ${id}`);
  };

  const addRenovationItem = (item: Omit<RenovationItem, "id">) => {
    const newItem: RenovationItem = { ...item, id: "r-" + Date.now() };
    setRenovationItems((prev) => {
      const next = [...prev, newItem];
      saveState("renovation", next);
      return next;
    });
    addAudit("Renovation Item Added", `Added repair item: ${newItem.item}`);
  };

  const updateProgrammeItem = (id: string, updates: Partial<ProgrammeActivity>) => {
    setProgramme((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveState("programme", next);
      return next;
    });
    addAudit("Programme Updated", `Updated programme schedule: ${id}`);
  };

  const addProgrammeItem = (item: Omit<ProgrammeActivity, "id">) => {
    const newItem: ProgrammeActivity = { ...item, id: "p-" + Date.now() };
    setProgramme((prev) => {
      const next = [...prev, newItem].sort((a, b) => a.order - b.order);
      saveState("programme", next);
      return next;
    });
  };

  const addVendor = (vendor: Omit<VendorItem, "id">) => {
    const newVendor: VendorItem = { ...vendor, id: "v-" + Date.now() };
    setVendors((prev) => {
      const next = [...prev, newVendor];
      saveState("vendors", next);
      return next;
    });
    addAudit("Vendor Added", `Registered vendor: ${newVendor.vendorName}`);
  };

  const updateVendor = (id: string, updates: Partial<VendorItem>) => {
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

  const loginFamily = (passcode: string, memberName: string): boolean => {
    const clean = passcode.trim().toUpperCase();
    if (clean === "AKHABUE2026" || clean === "2026" || clean === "AKHABUE" || clean === "1234") {
      setIsFamilyAuthenticated(true);
      setAuthenticatedMember(memberName || "Family Member");
      try {
        sessionStorage.setItem("akhabue_family_auth", "true");
        sessionStorage.setItem("akhabue_family_member", memberName || "Family Member");
      } catch {}
      setCurrentView("family");
      setIsAuthModalOpen(false);
      addAudit("Family Member Login", `${memberName} signed into private session`);
      return true;
    }
    return false;
  };

  const logoutFamily = () => {
    setIsFamilyAuthenticated(false);
    setAuthenticatedMember(null);
    try {
      sessionStorage.removeItem("akhabue_family_auth");
      sessionStorage.removeItem("akhabue_family_member");
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
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginFamily,
        logoutFamily,
        requestFamilyAccess,
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
