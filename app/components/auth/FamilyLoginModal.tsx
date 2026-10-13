"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePlanner } from "../../context/PlannerContext";
import {
  Lock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  X,
  Phone,
  KeyRound,
  Eye,
} from "lucide-react";

export const FamilyLoginModal: React.FC = () => {
  const router = useRouter();
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginFamily,
    loginFamilyWithPhone,
    setCurrentView,
    settings,
    familyMembers,
  } = usePlanner();

  const [identifier, setIdentifier] = useState("");
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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
      setCurrentView("family");
      setIsAuthModalOpen(false);
      router.push("/planning");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl text-left overflow-hidden">
        {/* Decorative ambient glow */}
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
        <div className="text-center mb-5">
          <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-amber-400/80 shadow-lg shadow-amber-500/20 mb-3">
            <Image
              src="/crest.jpg"
              alt="Akhabue Family Crest"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Confidential Planning Access</span>
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
            Planning Portal Login
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Please sign in to view the burial planning checklist for {settings.honoree}.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Registered Phone Number or Access Code *</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter phone number or code..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Password / 6-Digit Access PIN</span>
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={10}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter 6-digit access PIN..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Planning</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Registered children have <strong>View-Only</strong> access. The administrator has full editing control.
          </p>
        </div>
      </div>
    </div>
  );
};
