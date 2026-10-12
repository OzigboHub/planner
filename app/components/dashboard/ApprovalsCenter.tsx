"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { FamilyDecision } from "../../types";
import {
  FileCheck2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Calendar,
  PenTool,
  Save,
  MessageSquare,
  Lock,
} from "lucide-react";

export const ApprovalsCenter: React.FC = () => {
  const { decisions, updateDecision, userRole, canEdit } = usePlanner();

  const [notesState, setNotesState] = useState<{ [id: string]: string }>({});

  const handleStatusChange = (id: string, status: FamilyDecision["status"]) => {
    if (!canEdit) return;
    updateDecision(id, status, notesState[id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-rose-400">
          Section 11 & 13 • Governance & Consensus
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Family Decisions & Proposal Sign-Off
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Record family meeting consensus on dual portals, renovation cap, scope, and financial visibility
        </p>
      </div>

      {/* Advisory Banner from Section 13 */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
        <p className="font-bold text-amber-300 mb-1">
          Proposal Notice for Family Review:
        </p>
        <p className="text-slate-300 leading-relaxed">
          &ldquo;This proposal is for discussion. No development scope or provisional cost should be treated as approved until the family has reviewed it in meeting.&rdquo;
        </p>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.map((dec) => (
          <div
            key={dec.id}
            className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {dec.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {dec.description}
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {canEdit ? (
                  (["Approved", "Revise", "Not approved"] as FamilyDecision["status"][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(dec.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        dec.status === st
                          ? st === "Approved"
                            ? "bg-emerald-600 text-white shadow-md"
                            : st === "Revise"
                            ? "bg-amber-500 text-slate-950 shadow-md"
                            : "bg-rose-600 text-white shadow-md"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {st === "Approved" ? "✓ Approved" : st}
                    </button>
                  ))
                ) : (
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-default ${
                      dec.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : dec.status === "Revise"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-300 border-rose-500/20"
                    }`}
                    title="View-Only: Committee Council sign-off required"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>{dec.status === "Approved" ? "✓ Approved" : dec.status}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Decision Details & Notes */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Approved By / Committee</span>
                <span className="font-semibold text-white">{dec.approvedBy || "Family Council"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Decision Date</span>
                <span className="font-semibold text-white">{dec.dateDecided || "2026-10-08"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Family Notes</span>
                <span className="italic text-slate-300">{dec.notes || "Recorded in minutes"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formal Section 13 Meeting Sign-Off Record */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <PenTool className="w-4 h-4 text-amber-400" />
          <span>Family Council Sign-Off Record</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px]">Authorized Approvers:</span>
            <p className="font-bold text-white">Uwade Akhabue & Otibhor Akhabue (Committee & Treasury Leads)</p>
            <p className="text-slate-400 text-[10px]">On behalf of all 6 siblings and Eidenu, Irrua council</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-slate-400 text-[11px]">Meeting Date & Quorum:</span>
            <p className="font-bold text-white">Sunday, 11 October 2026 • Virtual Family Synod</p>
            <p className="text-emerald-400 text-[10px]">Unanimous consensus confirmed</p>
          </div>
        </div>
      </div>
    </div>
  );
};
