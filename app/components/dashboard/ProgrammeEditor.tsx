"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { ProgrammeActivity } from "../../types";
import {
  CalendarDays,
  Clock,
  Eye,
  EyeOff,
  Edit2,
  CheckCircle,
  Plus,
  MapPin,
} from "lucide-react";

export const ProgrammeEditor: React.FC = () => {
  const { programme, updateProgrammeItem, addProgrammeItem, canEdit } = usePlanner();

  const [editItem, setEditItem] = useState<ProgrammeActivity | null>(null);

  const togglePublic = (p: ProgrammeActivity) => {
    if (!canEdit) return;
    updateProgrammeItem(p.id, { publicVisible: !p.publicVisible });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!editItem) return;

    updateProgrammeItem(editItem.id, editItem);
    setEditItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Section 2 • Liturgical & Event Schedule
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Burial Programme & Schedule Editor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Synchronize with Parish priest, assign event leads, and control public guest visibility
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {programme.filter((p) => p.publicVisible).length} of {programme.length} published to guest portal
          </span>
        </div>
      </div>

      {/* Programme Cards List */}
      <div className="space-y-4">
        {programme.map((act) => (
          <div
            key={act.id}
            className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-amber-400/80 flex items-center justify-center font-bold text-amber-300 text-xs flex-shrink-0 shadow-sm mt-0.5">
                {act.order}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {act.activity}
                  </h3>
                  {act.day && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[10px] font-semibold border border-purple-500/20">
                      {act.day}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20 font-mono">
                    {act.time} ({act.duration})
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      act.status === "Confirmed"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                    }`}
                  >
                    {act.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{act.location}</span>
                </div>

                {act.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2 rounded-xl border border-white/5">
                    {act.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 flex-shrink-0">
              {canEdit ? (
                <>
                  <button
                    onClick={() => togglePublic(act)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      act.publicVisible
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                    }`}
                  >
                    {act.publicVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{act.publicVisible ? "Public Visible" : "Hidden (Draft)"}</span>
                  </button>

                  <button
                    onClick={() => setEditItem(act)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3 h-3 text-amber-400" />
                    <span>Edit Activity</span>
                  </button>
                </>
              ) : (
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-default ${
                    act.publicVisible
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {act.publicVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{act.publicVisible ? "Public Visible" : "Draft"}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>Edit Programme Activity</span>
              </h3>
              <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  value={editItem.activity}
                  onChange={(e) => setEditItem({ ...editItem, activity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Day / Section
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 29th – Vigil Mass"
                    value={editItem.day || ""}
                    onChange={(e) => setEditItem({ ...editItem, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Thursday, 29 October 2026"
                    value={editItem.date || ""}
                    onChange={(e) => setEditItem({ ...editItem, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={editItem.time}
                    onChange={(e) => setEditItem({ ...editItem, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={editItem.duration}
                    onChange={(e) => setEditItem({ ...editItem, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={editItem.location}
                    onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Lead Coordinator
                  </label>
                  <input
                    type="text"
                    value={editItem.coordinator}
                    onChange={(e) => setEditItem({ ...editItem, coordinator: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Liturgical / Coordination Notes
                </label>
                <textarea
                  rows={2}
                  value={editItem.notes}
                  onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
