"use client";

import React from "react";
import { usePlanner } from "../../context/PlannerContext";
import { Calendar, Clock, MapPin, Printer } from "lucide-react";

export const GuestProgramme: React.FC = () => {
  const { programme } = usePlanner();

  // Show only public approved activities
  const visibleActivities = programme
    .filter((p) => p.publicVisible)
    .sort((a, b) => a.order - b.order);

  // Group by day
  const days = [
    {
      id: "day-1",
      dayTitle: "October 29th – Vigil Mass",
      dateFormatted: "Thursday, 29 October 2026",
      items: visibleActivities.filter(
        (a) =>
          (a.day && a.day.includes("29")) ||
          a.activity.toLowerCase().includes("vigil") ||
          a.order === 1
      ),
    },
    {
      id: "day-2",
      dayTitle: "October 30th – Funeral and Burial Ceremony",
      dateFormatted: "Friday, 30 October 2026",
      items: visibleActivities.filter(
        (a) =>
          (!a.day || !a.day.includes("29")) &&
          !a.activity.toLowerCase().includes("vigil") &&
          a.order !== 1
      ),
    },
  ];

  return (
    <section id="section-programme" className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Liturgical &amp; Reception Timetable
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Burial Programme &amp; Arrangements
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            29th &amp; 30th October 2026 • Eidenu, Irrua, Edo State, Nigeria
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors w-fit shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-amber-400" />
          <span>Print Programme</span>
        </button>
      </div>

      <div className="space-y-12 my-6">
        {days.map((dayGroup) => (
          <div key={dayGroup.id} className="space-y-6">
            {/* Day Header Banner */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {dayGroup.dateFormatted}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {dayGroup.dayTitle}
                </h3>
              </div>
            </div>

            {/* Activities Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 space-y-6 ml-2 sm:ml-3">
              {dayGroup.items.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Step Marker Badge */}
                  <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-xs font-bold text-amber-300 shadow-md group-hover:scale-110 transition-transform">
                    {act.order}
                  </div>

                  <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all shadow-sm space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {act.time}
                        {act.duration && <span className="text-slate-400 font-sans">• {act.duration}</span>}
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        {act.status}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {act.activity}
                    </h4>

                    <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-400">Location:</span>
                      <span className="truncate text-slate-200 font-medium">{act.location}</span>
                    </div>

                    {act.notes && (
                      <p className="mt-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-white/5 leading-relaxed">
                        {act.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200">
        <p>
          <strong className="text-blue-300">Notice for Traveling Guests:</strong> Guests traveling along Benin-Auchi Expressway or from Ekpoma/Benin City are advised to arrive at Eidenu, Irrua in good time to allow ample time for parking at St. Matthew Catholic Church before the <strong>11:00 AM Funeral Mass</strong> begins promptly on Friday, October 30th.
        </p>
      </div>
    </section>
  );
};
