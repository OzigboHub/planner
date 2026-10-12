"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlannerProvider, usePlanner } from "../context/PlannerContext";
import { SimplePlannerView } from "../components/dashboard/SimplePlannerView";
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
} from "lucide-react";

function PortalContent() {
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
      setErrorMsg("Please enter your registered phone number or access code.");
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
      setErrorMsg("Access Denied: Unrecognized credentials. Please verify your registered details.");
    } else {
      setIdentifier("");
      setPasscode("");
    }
  };

  // If not authenticated, render secure, isolated login gate
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
              Confidential arrangements for {settings.honoree}. Authorized children and administrator only.
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number or Access Code *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. Registered phone number or assigned code"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Passcode / Access PIN
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter password or code..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
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

  // If authenticated, render dedicated planning portal header and simple planner view
  return (
    <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100">
      {/* Dedicated Portal Topbar */}
      <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-400/60 shadow">
            <Image src="/crest.jpg" alt="Akhabue Crest" fill className="object-cover" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
              Confidential Planning Portal
            </p>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {settings.honoree}
            </h2>
          </div>
        </div>

        {/* User state and actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
            {isAdmin ? (
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="font-semibold text-white max-w-[120px] sm:max-w-[180px] truncate">
              {authenticatedMember}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                isAdmin
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isAdmin ? "Admin" : "View-Only"}
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            title="Open Memorial in new tab"
          >
            <span>Public Memorial</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={logoutFamily}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
            title="Sign out of planning portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Simplified Planner View */}
      <main className="flex-1 w-full">
        <SimplePlannerView />
      </main>
    </div>
  );
}

export default function PortalPage() {
  return (
    <PlannerProvider>
      <PortalContent />
    </PlannerProvider>
  );
}
