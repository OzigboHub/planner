"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { Contribution } from "../../types";
import {
  Users,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock,
  Lock,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Eye,
} from "lucide-react";

export const ContributionsTracker: React.FC = () => {
  const {
    contributions,
    addContribution,
    updateContribution,
    financialMetrics,
    userRole,
    canEdit,
  } = usePlanner();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [location, setLocation] = useState("");
  const [promisedAmount, setPromisedAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [directPurchases, setDirectPurchases] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!name.trim() || !promisedAmount) return;

    addContribution({
      contributorName: name.trim(),
      relationship: relationship.trim() || "Sibling",
      location: location.trim() || "Nigeria",
      promisedAmount: Number(promisedAmount),
      receivedAmount: Number(receivedAmount) || 0,
      directPurchasesAmount: Number(directPurchases) || 0,
      notes: notes.trim() || undefined,
      status: (Number(receivedAmount) + Number(directPurchases) >= Number(promisedAmount)
        ? "Verified"
        : Number(receivedAmount) + Number(directPurchases) > 0
        ? "Partial"
        : "Pending") as Contribution["status"],
    });

    setIsAddOpen(false);
    setName("");
    setRelationship("");
    setLocation("");
    setPromisedAmount("");
    setReceivedAmount("");
    setDirectPurchases("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Section 3 & 5 • Private Family Ledger
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sibling & Family Contributions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Restricted access: Sibling pledges, cash received, and direct procurement offsets
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Record Sibling Commitment</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium w-fit">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>View-Only Ledger</span>
          </div>
        )}
      </div>

      {/* Sibling Ledger KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/10">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Pledged</p>
          <p className="text-xl font-black text-white font-mono mt-1">
            ₦{financialMetrics.totalPledged.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Committed by siblings & union</p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/20">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase">Total Received / Spent</p>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">
            ₦{financialMetrics.totalReceived.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Bank wire & direct purchases</p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/20">
          <p className="text-[11px] font-semibold text-amber-300 uppercase">Outstanding Pledges</p>
          <p className="text-xl font-black text-amber-300 font-mono mt-1">
            ₦{financialMetrics.outstandingPledges.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">To be remitted before event</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 p-4 rounded-2xl border border-emerald-500/30">
          <p className="text-[11px] font-semibold text-emerald-300 uppercase">Budget Coverage</p>
          <p className="text-xl font-black text-white font-mono mt-1">
            {financialMetrics.fundingCoveragePercent}%
          </p>
          <p className="text-[10px] text-emerald-300 mt-0.5">Of ₦4,895,000 working total</p>
        </div>
      </div>

      {/* Sibling Contributions Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Contributor / Branch</th>
                <th className="py-3 px-4">Relationship & Base</th>
                <th className="py-3 px-4">Promised (₦)</th>
                <th className="py-3 px-4">Direct Purchases (₦)</th>
                <th className="py-3 px-4">Cash Received (₦)</th>
                <th className="py-3 px-4">Total Recognized (₦)</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {contributions.map((c) => {
                const recognized = c.receivedAmount + c.directPurchasesAmount;
                const outstanding = Math.max(0, c.promisedAmount - recognized);

                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white text-xs">
                      {c.contributorName}
                      {c.notes && (
                        <div className="text-[10px] text-slate-400 font-normal italic truncate max-w-xs mt-0.5">
                          {c.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div>{c.relationship}</div>
                      <div className="text-[10px] text-slate-400">{c.location}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium">
                      ₦{c.promisedAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-purple-300">
                      {c.directPurchasesAmount > 0 ? `₦${c.directPurchasesAmount.toLocaleString()}` : "—"}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                      ₦{c.receivedAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-white font-bold">
                      ₦{recognized.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-amber-400">
                      {outstanding > 0 ? `₦${outstanding.toLocaleString()}` : "Cleared"}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          c.status === "Verified"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : c.status === "Partial"
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {canEdit ? (
                        c.status !== "Verified" ? (
                          <button
                            onClick={() => updateContribution(c.id, { status: "Verified" })}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium transition-colors"
                          >
                            Verify Receipt
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-medium">✓ Confirmed</span>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {c.status === "Verified" ? "✓ Confirmed" : "Pledged"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Log Sibling / Family Commitment</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contributor Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Brother Efe Akhabue"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. 4th Sibling"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location / Base
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Abuja / London"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Promised (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={promisedAmount}
                    onChange={(e) => setPromisedAmount(e.target.value)}
                    placeholder="750000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cash Paid (₦)
                  </label>
                  <input
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    placeholder="500000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Direct Purchases (₦)
                  </label>
                  <input
                    type="number"
                    value={directPurchases}
                    onChange={(e) => setDirectPurchases(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bank Reference / Direct Purchases Note
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Direct payment for food/drinks or bank slip details..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
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
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Save Sibling Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
