export type UserRole = "admin" | "sibling" | "guest";

export type DashboardSection =
  | "overview"
  | "children"
  | "budget"
  | "contributions"
  | "tasks"
  | "purchases"
  | "renovation"
  | "vendors"
  | "programme"
  | "documents"
  | "approvals"
  | "reports";

export interface BudgetItem {
  id: string;
  category:
    | "Logistics & Mortuary"
    | "Church & Liturgy"
    | "Food & Catering"
    | "Drinks & Refreshments"
    | "Rentals & Decor"
    | "Sound & Power"
    | "Sanitation & Logistics"
    | "Media & Printing"
    | "Administration & Emergency"
    | "Family Residence Renovation";
  name: string;
  provisionalAllowance: number;
  quotedAmount?: number;
  actualCost?: number;
  amountPaid: number;
  paidStatus: "Unpaid" | "Partial" | "Paid" | "Pending Quote";
  assignedLead?: string;
  notes?: string;
  receiptUrl?: string;
  isDone?: boolean;
}

export interface Contribution {
  id: string;
  contributorName: string;
  relationship: string;
  location: string;
  promisedAmount: number;
  receivedAmount: number;
  directPurchasesAmount: number;
  notes?: string;
  status: "Verified" | "Partial" | "Pending";
  dateLogged: string;
}

export interface TaskItem {
  id: string;
  workstream: string;
  title: string;
  assignedPerson: string;
  deadline: string;
  status: "To Do" | "In Progress" | "Completed" | "Blocked";
  priority: "High" | "Medium" | "Low";
  notes?: string;
  supportingFiles?: string;
}

export interface ShoppingItem {
  id: string;
  item: string;
  category: string;
  quantity: string;
  estimatedPrice: number;
  supplierQuote?: number;
  amountPaid: number;
  buyer: string;
  status: "Pending Quote" | "Approved" | "Purchased" | "Received";
  receiptNote?: string;
}

export interface RenovationItem {
  id: string;
  item: string;
  description: string;
  contractor: string;
  estimate: number;
  quotedAmount: number;
  paidAmount: number;
  progressPercent: number;
  status: "Pending Quote" | "Quoted" | "In Progress" | "Completed";
  materialsQuote?: number;
  labourQuote?: number;
  signOffLead?: string;
}

export interface VendorItem {
  id: string;
  serviceCategory: string;
  vendorName: string;
  contactPerson: string;
  phone: string;
  quotedAmount: number;
  depositPaid: number;
  balanceDue: number;
  bookingStatus: "Inquiry" | "Quoted" | "Deposit Paid" | "Confirmed" | "Completed";
  confirmationDate?: string;
  notes?: string;
}

export interface ProgrammeActivity {
  order: number;
  id: string;
  activity: string;
  time: string;
  duration: string;
  location: string;
  coordinator: string;
  status: "Confirmed" | "Tentative" | "Pending Parish Confirmation";
  publicVisible: boolean;
  notes: string;
}

export interface EventDocument {
  id: string;
  title: string;
  category: "Mortuary & Clearance" | "Church & Liturgy" | "Quotes & Invoices" | "Bank & Receipts" | "Legal & Permits";
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  accessRestricted: boolean;
  notes?: string;
}

export interface FamilyDecision {
  id: string;
  title: string;
  description: string;
  status: "Approved" | "Revise" | "Not approved" | "Under Discussion";
  approvedBy?: string;
  notes?: string;
  dateDecided?: string;
}

export interface GuestRSVP {
  id: string;
  guestName: string;
  phoneOrEmail: string;
  attendance: "Attending In-Person" | "Attending Virtually / In Spirit" | "Regrets";
  partySize: number;
  dietaryOrNotes?: string;
  submittedAt: string;
}

export interface CondolenceTribute {
  id: string;
  authorName: string;
  relationship: string;
  location: string;
  message: string;
  candleLit: boolean;
  submittedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface EventSettings {
  eventTitle: string;
  honoree: string;
  honoreeEpitaph: string;
  date: string;
  churchVenue: string;
  churchAddress: string;
  residenceVenue: string;
  residenceAddress: string;
  expectedGuests: number;
  renovationCap: number;
  contingencyRate: number; // e.g. 0.10
  publicBudgetVisible: boolean;
  publicDonationsEnabled: boolean;
  bankDetails: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    referenceCode: string;
  };
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
}

export type PermissionLevel = "view_only" | "view_and_edit";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string; // e.g. "1st Sibling • Eldest Son", "2nd Sibling", "Daughter", "Grandchild"
  branch?: string; // e.g. "Diaspora (United Kingdom)", "Lagos", "Benin City", "Abuja", "Warri", "Port Harcourt", "Irrua Home"
  phone?: string;
  email?: string;
  location?: string;
  assignedRole?: string; // e.g. "Diaspora Advisory Lead", "Committee Treasurer", "Church Liturgy"
  loginCode: string; // Unique access code created by Admin (e.g. "OSAS-2026", "JUDE-2026")
  status: "Active" | "Pending" | "Invited";
  permission: PermissionLevel; // Default: "view_only", Admin-controlled: "view_and_edit"
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

