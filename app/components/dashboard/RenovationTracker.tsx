"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { RenovationItem } from "../../types";
import {
  Home,
  Plus,
  CheckCircle,
  Hammer,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Eye,
} from "lucide-react";

export const RenovationTracker: React.FC = () => {
  const {
    renovationItems,
    addRenovationItem,
    updateRenovationItem,
    settings,
    canEdit,
  } = usePlanner();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RenovationItem | null>(null);

  // Form State
  const [itemTitle, setItemTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [contractor, setContractor] = useState("");
  const [materialsQuote, setMaterialsQuote] = useState("");
  const [labourQuote, setLabourQuote] = useState("");
  const [signOffLead, setSignOffLead] = useState("Engr. Kenneth");

  const totalQuoted = renovationItems.reduce((acc, curr) => acc + curr.quotedAmount, 0);
  const totalPaid = renovationItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const cap = settings.renovationCap;
  const capRemaining = cap - totalQuoted;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!itemTitle.trim() || !materialsQuote) return;

    const mat = Number(materialsQuote) || 0;
    const lab = Number(labourQuote) || 0;
    const total = mat + lab;

    addRenovationItem({
      item: itemTitle.trim(),
      description: desc.trim() || "Repair work for family compound.",
      contractor: contractor.trim() || "Local Artisan",
      estimate: total,
      quotedAmount: total,
      paidAmount: 0,
      progressPercent: 0,
      status: "Quoted",
      materialsQuote: mat,
      labourQuote: lab,
      signOffLead: signOffLead.trim(),
    });

    setIsAddOpen(false);
    setItemTitle("");
    setDesc("");
    setContractor("");
    setMaterialsQuote("");
    setLabourQuote("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
            Section 7 • Residence Preparation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mini-Renovation Tracker (₦500,000 Cap)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Detailed itemization, contractor quotes, materials vs labour, and completion evidence
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Add Repair Item</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium w-fit">
            <Eye className="w-4 h-4 text-purple-400" />
            <span>View-Only Tracker</span>
          </div>
        )}
      </div>

      {/* Cap Consumption & Progress Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-purple-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Provisional Family Cap
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                ₦{cap.toLocaleString()}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
              ₦{totalQuoted.toLocaleString()}{" "}
              <span className="text-xs font-normal text-slate-400 font-sans">
                committed across {renovationItems.length} repair projects
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-white/5 text-right">
              <p className="text-[10px] text-slate-400 uppercase">Paid Advance</p>
              <p className="text-sm font-bold text-emerald-400 font-mono">
                ₦{totalPaid.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-white/5 text-right">
              <p className="text-[10px] text-slate-400 uppercase">Cap Headroom</p>
              <p
                className={`text-sm font-bold font-mono ${
                  capRemaining >= 0 ? "text-amber-400" : "text-rose-400"
                }`}
              >
                ₦{capRemaining.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar of Cap Usage */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-white/5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              totalQuoted <= cap ? "bg-purple-500" : "bg-rose-500"
            }`}
            style={{ width: `${Math.min(100, (totalQuoted / cap) * 100)}%` }}
          />
        </div>
      </div>

      {/* Itemized Repair Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renovationItems.map((reno) => (
          <div
            key={reno.id}
            className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 hover:border-purple-400/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-purple-400" />
                  <span>{reno.contractor}</span>
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    reno.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                  }`}
                >
                  {reno.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">
                {reno.item}
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {reno.description}
              </p>

              {/* Materials vs Labour breakdown */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-white/5 text-xs font-mono mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Materials Quote</span>
                  <span className="text-slate-200">₦{(reno.materialsQuote || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Labour Quote</span>
                  <span className="text-slate-200">₦{(reno.labourQuote || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Execution Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Work Execution Progress</span>
                  <span className="text-purple-300 font-bold font-mono">{reno.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${reno.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                <span>Sign-off: </span>
                <strong className="text-white">{reno.signOffLead}</strong>
              </div>

              <div className="flex items-center gap-2">
                {canEdit ? (
                  <button
                    onClick={() => {
                      const next = Math.min(100, reno.progressPercent + 20);
                      updateRenovationItem(reno.id, {
                        progressPercent: next,
                        status: next === 100 ? "Completed" : "In Progress",
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                  >
                    +20% Progress
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">Sign-Off Required</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-purple-400" />
                <span>Add Residence Repair Scope</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Repair Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Guest Restroom Water Heater & Cistern Replacement"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Scope & Item Description
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Details of materials, repairs, and target completion..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contractor / Artisan
                  </label>
                  <input
                    type="text"
                    value={contractor}
                    onChange={(e) => setContractor(e.target.value)}
                    placeholder="e.g. Apex Plumbing Works"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Family Sign-Off Lead
                  </label>
                  <input
                    type="text"
                    value={signOffLead}
                    onChange={(e) => setSignOffLead(e.target.value)}
                    placeholder="Engr. Kenneth"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Materials Quote (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={materialsQuote}
                    onChange={(e) => setMaterialsQuote(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Labour Quote (₦)
                  </label>
                  <input
                    type="number"
                    value={labourQuote}
                    onChange={(e) => setLabourQuote(e.target.value)}
                    placeholder="25000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Save Repair Scope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
