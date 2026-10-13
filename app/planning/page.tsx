"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlanner } from "../context/PlannerContext";
import { SimplePlannerView } from "../components/dashboard/SimplePlannerView";
import { BudgetManager } from "../components/dashboard/BudgetManager";
import { RenovationTracker } from "../components/dashboard/RenovationTracker";
import { PurchasingList } from "../components/dashboard/PurchasingList";
import { VendorsTracker } from "../components/dashboard/VendorsTracker";
import { ProgrammeEditor } from "../components/dashboard/ProgrammeEditor";
import { PrintableReport } from "../components/dashboard/PrintableReport";
import { ChildrenOnboarding } from "../components/dashboard/ChildrenOnboarding";
import {
  Lock,
  ShieldCheck,
  Eye,
  LogOut,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ExternalLink,
  ChevronLeft,
  Phone,
  CheckCircle2,
  DollarSign,
  Users,
  Hammer,
  ShoppingBag,
  Truck,
  Calendar,
  Printer,
} from "lucide-react";

type PlanningTab =
  | "checklist"
  | "renovation"
  | "budget"
  | "purchases"
  | "vendors"
  | "programme"
  | "reports"
  | "children";

export default function PlanningPage() {
  const {
    isFamilyAuthenticated,
    authenticatedMember,
    isAdmin,
    userPermission,
    loginFamily,
    loginFamilyWithPhone,
    logoutFamily,
    settings,
    familyMembers,
  } = usePlanner();

  const [activeTab, setActiveTab] = useState<PlanningTab>("checklist");

  // Login form state
  const [identifier, setIdentifier] = useState("");
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanInput = identifier.trim();
    const cleanPass = passcode.trim();

    if (!cleanInput) {
      setErrorMsg("Please enter your registered phone number or access PIN.");
      return;
    }

    let success = false;

    // 1. Try phone + passcode
    if (cleanPass) {
      success = loginFamilyWithPhone(cleanInput, cleanPass);
    }

    // 2. Try direct passcode match with identifier
    if (!success) {
      success = loginFamily(cleanPass || cleanInput);
    }

    // 3. Try matching identifier as phone number to registered members
    if (!success) {
      const matched = familyMembers.find((m) => {
        const cleanM = (m.phone || "").replace(/[^0-9]/g, "");
        const cleanIn = cleanInput.replace(/[^0-9]/g, "");
        return cleanIn && cleanM && (cleanM.endsWith(cleanIn) || cleanIn.endsWith(cleanM));
      });
      if (matched && (!cleanPass || cleanPass.toUpperCase() === matched.loginCode.toUpperCase())) {
        success = loginFamily(matched.loginCode, matched.name);
      }
    }

    if (!success) {
      setErrorMsg("Access Denied: Unrecognized credentials. Please verify your phone number and 6-digit access PIN.");
    } else {
      setIdentifier("");
      setPasscode("");
    }
  };

  // If not authenticated, render secure login gate
  if (!isFamilyAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b12] text-slate-100 p-4 relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-amber-400/80 shadow-lg shadow-amber-500/20 mb-3">
              <Image
                src="/crest.jpg"
                alt="Akhabue Family Crest"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Family Portal</span>
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Burial Planning Access
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Confidential arrangements for {settings.honoree}. Authorized children and family committee only.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Registered Phone Number *</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 07069439011 (Uwade) or 08010000001 (Admin)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>6-Digit Access PIN *</span>
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={10}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter your 6-digit access PIN..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-mono tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate &amp; Enter Portal</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          {/* Return link to public memorial */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Return to Public Memorial</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render full Planning Portal
  return (
    <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100 w-full overflow-x-hidden">
      {/* Dedicated Portal Topbar */}
      <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/" className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-amber-400/60 shadow flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image src="/crest.jpg" alt="Akhabue Crest" fill className="object-cover" />
          </Link>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-400 font-bold truncate">
              Planning Portal
            </p>
            <h2 className="text-xs sm:text-base font-bold text-white tracking-tight truncate max-w-[125px] sm:max-w-none">
              {settings.honoree}
            </h2>
          </div>
        </div>

        {/* User state and actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
            {isAdmin ? (
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span className="font-semibold text-white max-w-[80px] sm:max-w-[180px] truncate text-[11px] sm:text-xs">
              {authenticatedMember}
            </span>
            <span
              className={`text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold uppercase ${
                isAdmin
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isAdmin ? "Admin" : "View"}
            </span>
          </div>

          <Link
            href="/"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            title="Open Memorial Home"
          >
            <span>Memorial Home</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={logoutFamily}
            className="flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
            title="Sign out of planning portal"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Planning Navigation Tabs */}
      <nav className="bg-slate-900/90 border-b border-white/10 px-2 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "checklist"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Checklist</span>
            <span className="hidden sm:inline">Checklist &amp; Balances</span>
          </button>

          <button
            onClick={() => setActiveTab("renovation")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "renovation"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Hammer className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Renovation</span>
            <span className="hidden sm:inline">House Renovation</span>
          </button>

          <button
            onClick={() => setActiveTab("budget")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "budget"
                ? "bg-slate-700 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Budget</span>
            <span className="hidden sm:inline">Detailed Budget</span>
          </button>

          <button
            onClick={() => setActiveTab("purchases")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "purchases"
                ? "bg-slate-700 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Purchases</span>
            <span className="hidden sm:inline">Purchases List</span>
          </button>

          <button
            onClick={() => setActiveTab("vendors")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "vendors"
                ? "bg-slate-700 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span>Vendors</span>
          </button>

          <button
            onClick={() => setActiveTab("programme")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "programme"
                ? "bg-slate-700 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Programme</span>
            <span className="hidden sm:inline">Order of Events</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "reports"
                ? "bg-slate-700 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Print</span>
            <span className="hidden sm:inline">Print Report</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab("children")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "children"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-purple-300 hover:text-white hover:bg-purple-900/30"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Codes ({familyMembers.length})</span>
              <span className="hidden sm:inline">Children &amp; Codes ({familyMembers.length})</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 overflow-x-hidden">
        {activeTab === "checklist" && <SimplePlannerView />}
        {activeTab === "renovation" && <RenovationTracker />}
        {activeTab === "budget" && <BudgetManager />}
        {activeTab === "purchases" && <PurchasingList />}
        {activeTab === "vendors" && <VendorsTracker />}
        {activeTab === "programme" && <ProgrammeEditor />}
        {activeTab === "reports" && <PrintableReport />}
        {activeTab === "children" && <ChildrenOnboarding />}
      </main>
    </div>
  );
}
