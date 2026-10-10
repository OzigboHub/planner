"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePlanner } from "../context/PlannerContext";
import {
  Calendar,
  Clock,
  ShieldCheck,
  UserCheck,
  Printer,
  RotateCcw,
  LayoutDashboard,
  Heart,
  ChevronDown,
  Lock,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    userRole,
    setUserRole,
    settings,
    resetToDefaults,
    isFamilyAuthenticated,
    authenticatedMember,
    logoutFamily,
    requestFamilyAccess,
  } = usePlanner();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const calculateCountdown = () => {
      const eventDate = new Date("2026-10-30T09:00:00").getTime();
      const diff = Math.max(0, eventDate - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      });
    };
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close menus whenever the auth state or view changes
  useEffect(() => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  }, [isFamilyAuthenticated, currentView]);

  const handlePrint = () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    window.print();
  };

  const handleReset = () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    if (confirm("Reset all planner data back to the original Proposal document defaults?")) {
      resetToDefaults();
    }
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    requestFamilyAccess();
  };

  const countdownText = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m to Burial`;

  const viewButtonClass = (active: boolean, activeColors: string) =>
    `flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
      active ? `${activeColors} font-semibold shadow-md` : "text-slate-400 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-white/10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Image src="/crest.jpg" alt="Family Memorial Crest" fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="hidden sm:block text-[10px] uppercase tracking-widest font-semibold text-amber-400 truncate">
                {isFamilyAuthenticated ? "Planning Portal" : "Memorial & Funeral Service"}
                <span className="text-emerald-400 normal-case tracking-normal font-medium"> • Eidenu, Irrua</span>
              </p>
              <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-tight truncate">
                {settings.honoree}
              </h1>
            </div>
          </div>

          {/* Countdown (wide screens only) */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs flex-shrink-0">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-medium">Fri, 30 Oct 2026</span>
            <span className="text-slate-600">•</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-amber-300 font-semibold">{countdownText}</span>
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isFamilyAuthenticated ? (
              <>
                <div className="flex p-1 bg-slate-900/90 rounded-xl border border-white/10">
                  <button
                    id="btn-guest-view"
                    onClick={() => setCurrentView("guest")}
                    className={viewButtonClass(currentView === "guest", "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950")}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Memorial</span>
                  </button>
                  <button
                    id="btn-family-dashboard"
                    onClick={() => setCurrentView("family")}
                    className={viewButtonClass(currentView === "family", "bg-gradient-to-r from-blue-600 to-indigo-600 text-white")}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Planning</span>
                  </button>
                </div>

                {/* Single account menu holds everything else */}
                <div className="relative">
                  <button
                    id="btn-account-menu"
                    onClick={() => setAccountMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="max-w-[120px] truncate">{authenticatedMember}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {accountMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAccountMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
                        <div className="px-3 pb-2 mb-1 border-b border-slate-800">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Signed in as</p>
                          <p className="text-sm text-white font-semibold truncate">{authenticatedMember}</p>
                        </div>

                        <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-amber-400" /> Planning Role
                        </p>
                        {(["admin", "sibling"] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => {
                              setUserRole(role);
                              setAccountMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${
                              userRole === role ? "text-amber-400 font-semibold" : "text-slate-300"
                            }`}
                          >
                            <span>{role === "admin" ? "Family Administrator" : "Sibling Member"}</span>
                            {userRole === role && <span className="text-[10px]">Active</span>}
                          </button>
                        ))}

                        <div className="my-1 border-t border-slate-800" />
                        <button onClick={handlePrint} className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-300 hover:bg-slate-800">
                          <Printer className="w-3.5 h-3.5" /> Print Planning Dossier
                        </button>
                        <button onClick={handleReset} className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-300 hover:bg-slate-800">
                          <RotateCcw className="w-3.5 h-3.5" /> Reset to Proposal Defaults
                        </button>

                        <div className="my-1 border-t border-slate-800" />
                        <button
                          id="btn-family-logout"
                          onClick={logoutFamily}
                          className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-300 hover:bg-rose-500/10 font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                id="btn-nav-planning-login"
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm whitespace-nowrap transition-all shadow-md shadow-amber-500/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Planning Login</span>
              </button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            {!isFamilyAuthenticated && (
              <button
                id="btn-nav-planning-login-mobile"
                onClick={handleLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs whitespace-nowrap shadow-md"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#090d16] px-4 py-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700/80 text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-slate-300">Fri, 30 Oct 2026</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-300 font-semibold">{countdownText}</span>
          </div>

          {isFamilyAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold truncate">{authenticatedMember}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-white/10">
                <button
                  onClick={() => setCurrentView("guest")}
                  className={viewButtonClass(currentView === "guest", "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950")}
                >
                  <Heart className="w-3.5 h-3.5" /> Memorial
                </button>
                <button
                  onClick={() => setCurrentView("family")}
                  className={viewButtonClass(currentView === "family", "bg-gradient-to-r from-blue-600 to-indigo-600 text-white")}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Planning
                </button>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Planning Role</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["admin", "sibling"] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRole(role)}
                      className={`px-3 py-2 rounded-xl text-xs border ${
                        userRole === role
                          ? "bg-amber-500/15 border-amber-400/40 text-amber-300 font-semibold"
                          : "bg-slate-900 border-slate-800 text-slate-300"
                      }`}
                    >
                      {role === "admin" ? "Administrator" : "Sibling"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={handlePrint} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={handleReset} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              <button
                onClick={logoutFamily}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-400 px-1">
              Planning information is private. Children and committee members can sign in with the{" "}
              <span className="text-amber-300 font-semibold">Login</span> button above.
            </p>
          )}
        </div>
      )}
    </header>
  );
};
