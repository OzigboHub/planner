"use client";

import React from "react";
import { usePlanner } from "../../context/PlannerContext";

export const GuestFooter: React.FC = () => {
  const { isFamilyAuthenticated, setCurrentView, setIsAuthModalOpen, settings } = usePlanner();

  return (
    <footer className="mt-auto py-12 border-t border-white/10 bg-slate-950 text-slate-400 text-xs no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white text-sm">
            The Akhabue Family Planning Secretariat
          </p>
          <p className="text-slate-400 mt-0.5">
            Eidenu, Irrua, Edo State • Contact: {settings.contactPhone}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            In Blessed &amp; Loving Memory of Festus Okoruwa Akhabue
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              if (isFamilyAuthenticated) {
                setCurrentView("family");
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer text-xs"
          >
            <span>Burial Planning Portal</span>
          </button>
          <span className="text-slate-600 text-[11px]">
            &copy; 2026 The Akhabue Family • All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
};
