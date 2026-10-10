"use client";

import React from "react";
import { GuestMemorialHero } from "./GuestMemorialHero";
import { GuestAbout } from "./GuestAbout";
import { GuestProgramme } from "./GuestProgramme";
import { GuestVenues } from "./GuestVenues";
import { GuestCondolences } from "./GuestCondolences";
import { GuestSupport } from "./GuestSupport";
import { usePlanner } from "../../context/PlannerContext";
import { Heart, Shield, Lock, ArrowRight } from "lucide-react";

export const GuestView: React.FC = () => {
  const { requestFamilyAccess, isFamilyAuthenticated, settings } = usePlanner();

  return (
    <div className="flex-1 flex flex-col">
      {/* Memorial Hero */}
      <GuestMemorialHero />

      {/* About Pa Festus Okoruwa Akhabue - Life, Faith & Legacy */}
      <GuestAbout />

      {/* Burial Programme Schedule */}
      <GuestProgramme />

      {/* Venues & Logistics */}
      <GuestVenues />

      {/* Condolence Guestbook & Candles */}
      <GuestCondolences />

      {/* Voluntary Support / Account */}
      <GuestSupport />

      {/* Dignified Footer */}
      <footer className="mt-auto py-12 border-t border-white/10 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-white text-sm">
              The Akhabue Family Planning Secretariat
            </p>
            <p className="text-slate-400 mt-0.5">
              Eidenu, Irrua, Edo State • Contact: {settings.contactPhone}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              In Blessed & Loving Memory of Pa Festus Okoruwa Akhabue
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={requestFamilyAccess}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFamilyAuthenticated ? "Access Planning Dashboard" : "Planning Committee & Children Login"}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
