"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Eye,
  Edit3,
  Share2,
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
    canEdit,
    userPermission,
    isAdmin,
    isInvitedGuest,
    setIsShareModalOpen,
    setIsAuthModalOpen,
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

  const pathname = usePathname();

  const navLinks = [
    { href: "/order-of-mass", label: "Order of Mass" },
    { href: "/programme", label: "Burial Programme" },
    { href: "/about", label: "About Pa Festus" },
    { href: "/#section-venues", label: "Directions & Venues" },
    { href: "/tributes", label: "Memorial Tributes" },
    { href: "/support", label: "Support the Family" },
  ];

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
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0 hover:opacity-90 transition-opacity">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Image src="/crest.jpg" alt="Family Memorial Crest" fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 truncate">
                {isFamilyAuthenticated ? "Planning Portal" : "Memorial Service"}
                <span className="text-emerald-400 font-medium"> • Irrua</span>
              </p>
              <h1 className="text-xs sm:text-base md:text-lg font-bold text-white tracking-tight leading-tight truncate">
                {settings.honoree}
              </h1>
            </div>
          </Link>

          {/* Navigation Links for Dedicated Pages */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isOrderOfMass = link.href === "/order-of-mass";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40"
                      : isOrderOfMass
                      ? "text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 font-medium"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Countdown (extra wide screens only) */}
          <div className="hidden 2xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs flex-shrink-0">
            <span className="text-slate-300 font-medium">Fri, 30 Oct 2026</span>
            <span className="text-slate-600">•</span>
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
                    <span>Memorial</span>
                  </button>
                  <button
                    id="btn-family-dashboard"
                    onClick={() => setCurrentView("family")}
                    className={viewButtonClass(currentView === "family", "bg-gradient-to-r from-blue-600 to-indigo-600 text-white")}
                  >
                    <span>Planning</span>
                  </button>
                </div>

                {/* Single account menu holds everything else */}
                <div className="relative">
                  <button
                    id="btn-account-menu"
                    onClick={() => setAccountMenuOpen((o) => !o)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                      canEdit
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                    }`}
                  >
                    <span className="max-w-[120px] truncate">{authenticatedMember}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        canEdit
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {canEdit ? "Edit" : "View Only"}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {accountMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAccountMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
                        <div className="px-3 pb-2 mb-1 border-b border-slate-800">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Signed in as</p>
                          <p className="text-sm text-white font-semibold truncate">{authenticatedMember}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                canEdit
                                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                              }`}
                            >
                              <span>{canEdit ? "View & Edit Authorized" : "View-Only (Default)"}</span>
                            </span>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 bg-slate-950/60 rounded-lg mx-2 mb-1 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Role:</span>
                          <span className="font-semibold text-amber-300">
                            {isAdmin ? "Family Administrator" : "Sibling (View-Only)"}
                          </span>
                        </div>

                        <div className="my-1 border-t border-slate-800" />
                        <button onClick={handlePrint} className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800">
                          Print Planning Dossier
                        </button>
                        <button onClick={handleReset} className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800">
                          Reset to Proposal Defaults
                        </button>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setIsShareModalOpen(true);
                          }}
                          className="w-full text-left px-3 py-2 text-amber-300 hover:bg-slate-800 font-medium"
                        >
                          Share Invitation Link
                        </button>

                        <div className="my-1 border-t border-slate-800" />
                        <button
                          id="btn-family-logout"
                          onClick={logoutFamily}
                          className="w-full text-left px-3 py-2 text-rose-300 hover:bg-rose-500/10 font-semibold"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                id="btn-nav-planning-gate"
                onClick={() => {
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs whitespace-nowrap transition-all shadow-md shadow-indigo-600/20 border border-white/10"
                title="Access burial planning and checklist"
              >
                Planning
              </button>
            )}

            {/* Invite Guest Button (Hidden when opening via invitation link) */}
            {!isInvitedGuest && (
              <button
                id="btn-nav-invite-guest"
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs border border-amber-500/40 transition-all shadow-sm shadow-amber-500/10"
              >
                Invite Guest
              </button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            {!isInvitedGuest && (
              <button
                id="btn-nav-invite-mobile"
                onClick={() => setIsShareModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold text-xs border border-amber-500/40 shadow-sm transition-colors"
              >
                Invite
              </button>
            )}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Fixed Sticky Countdown Bar (Remains fixed, static & clearly visible as user scrolls) */}
      <div className="xl:hidden bg-slate-900/95 border-t border-white/10 py-1.5 px-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 text-slate-300 font-medium">
            <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Fri, 30 Oct 2026</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-amber-300 font-bold font-mono">
            <Clock className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
            <span>{countdownText}</span>
          </div>
        </div>
      </div>

      {/* Mobile slide-down panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#090d16] px-4 py-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {isFamilyAuthenticated ? (
            <>
              {/* Authenticated Member Banner */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-semibold text-emerald-400/80">Family Access</p>
                  <p className="font-bold text-emerald-200 truncate">{authenticatedMember}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isAdmin ? "Admin" : canEdit ? "Edit" : "View Only"}
                </span>
              </div>

              {/* View Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-white/10">
                <button
                  id="btn-mobile-memorial-view"
                  onClick={() => {
                    setCurrentView("guest");
                    setMobileMenuOpen(false);
                  }}
                  className={viewButtonClass(currentView === "guest", "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold")}
                >
                  <Heart className="w-3.5 h-3.5" /> Memorial
                </button>
                <button
                  id="btn-mobile-planning-view"
                  onClick={() => {
                    setCurrentView("family");
                    setMobileMenuOpen(false);
                  }}
                  className={viewButtonClass(currentView === "family", "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold")}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Planning
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1.5 pt-1">
                <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pages</p>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold"
                          : "bg-slate-900/80 border border-slate-800/80 text-slate-200 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-slate-500 text-xs">→</span>
                    </Link>
                  );
                })}
              </div>

              {/* Family Controls */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white font-medium"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              <button
                id="btn-family-logout-mobile"
                onClick={logoutFamily}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="space-y-1.5">
                <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pages</p>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold"
                          : "bg-slate-900/80 border border-slate-800/80 text-slate-200 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-slate-500 text-xs">→</span>
                    </Link>
                  );
                })}
              </div>

              {/* Family Planning Portal Link */}
              <div className="pt-2 border-t border-white/10">
                <button
                  id="btn-mobile-planning-portal"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/20 border border-blue-500/30 text-blue-200 hover:text-white hover:border-blue-500/50 transition-all font-medium text-xs"
                >
                  <div className="text-left">
                    <div className="font-semibold text-white">Family Planning Portal</div>
                    <div className="text-[10px] text-blue-300/70">Children login &amp; checklist</div>
                  </div>
                  <span className="text-xs text-blue-400 font-semibold">Access →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
