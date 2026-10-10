"use client";

import React from "react";
import { usePlanner } from "../../context/PlannerContext";
import { Clock, MapPin, User, CheckCircle2, AlertCircle, Printer } from "lucide-react";

export const GuestProgramme: React.FC = () => {
  const { programme } = usePlanner();

  // Show only public approved activities
  const visibleActivities = programme
    .filter((p) => p.publicVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="section-programme" className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Liturgical & Reception Timetable
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Order of Funeral Ceremonies
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Friday, 30 October 2026 • Timetable confirmed with Parish and Family Elders
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors w-fit"
        >
          <Printer className="w-3.5 h-3.5 text-amber-400" />
          <span>Print Programme</span>
        </button>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 space-y-8 my-6">
        {visibleActivities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Step Marker Badge */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-xs font-bold text-amber-300 shadow-md group-hover:scale-110 transition-transform">
              {act.order}
            </div>

            <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  {act.time} ({act.duration})
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {act.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                {act.activity}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{act.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="truncate">Lead: {act.coordinator}</span>
                </div>
              </div>

              {act.notes && (
                <p className="mt-3 text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-white/5 italic">
                  Note: {act.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Notice for Traveling Guests:</strong> Guests traveling along Benin-Auchi Expressway or from Ekpoma are advised to arrive at Irrua / Eidenu by 8:30 AM to allow ample time for parking at St. Matthew Catholic Church before the 10:00 AM Funeral Mass begins promptly.
        </p>
      </div>
    </section>
  );
};
