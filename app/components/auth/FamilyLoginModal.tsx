"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePlanner } from "../../context/PlannerContext";
import { Lock, ShieldCheck, KeyRound, UserCheck, AlertCircle, ArrowRight, X } from "lucide-react";

export const FamilyLoginModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginFamily,
    settings,
  } = usePlanner();

  const childrenMembers = [
    { name: "Dr. Osas Akhabue", role: "1st Sibling • Diaspora Lead" },
    { name: "Barr. Jude Akhabue", role: "2nd Sibling • Committee Treasurer" },
    { name: "Sister Mary Akhabue", role: "3rd Sibling • Church & Liturgy" },
    { name: "Brother Efe Akhabue", role: "4th Sibling • Drinks & Logistics" },
    { name: "Aunty Blessing (Nee Akhabue)", role: "5th Sibling • Kitchen & Catering" },
    { name: "Engr. Kenneth Akhabue", role: "6th Sibling • Residence Renovation" },
    { name: "Family Committee Admin", role: "Executive Committee Administrator" },
  ];

  const [selectedChild, setSelectedChild] = useState<string>(childrenMembers[0].name);
  const [passcode, setPasscode] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const success = loginFamily(passcode, selectedChild);
    if (!success) {
      setErrorMsg("Incorrect family passcode. Enter 'AKHABUE2026' or '2026'.");
    } else {
      setPasscode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border border-amber-400/30 p-6 sm:p-8 shadow-2xl text-left overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setErrorMsg("");
          }}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Crest */}
        <div className="text-center mb-6">
          <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-amber-400/80 shadow-lg shadow-amber-500/20 mb-3">
            <Image
              src="/crest.jpg"
              alt="Akhabue Family Crest"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
            Confidential Planning Session
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
            Planning Committee & Children Login
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access to confidential budget ledger, sibling contributions, tasks, vendors, and renovation records for {settings.honoree}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Your Name (Child / Committee Member) *</span>
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
            >
              {childrenMembers.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} — {m.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Family Security Passcode *</span>
            </label>
            <input
              type="password"
              required
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 font-mono tracking-wider"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
              <span>Security hint:</span>
              <span className="text-amber-400 font-mono font-semibold">AKHABUE2026 or 2026</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Planning Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Restricted in accordance with Section 5 privacy guidelines. Sibling balances are never exposed to the public.
          </p>
        </div>
      </div>
    </div>
  );
};
