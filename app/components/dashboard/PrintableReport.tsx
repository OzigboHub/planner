"use client";

import React from "react";
import { usePlanner } from "../../context/PlannerContext";
import {
  Printer,
  Download,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Building,
  Phone,
  ShieldCheck,
} from "lucide-react";

export const PrintableReport: React.FC = () => {
  const {
    settings,
    financialMetrics,
    budgetItems,
    programme,
    tasks,
    contributions,
    renovationItems,
  } = usePlanner();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Offline Readiness & Official Brief
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Print & Export Master Dossier
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Optimized for PDF export and high-resolution paper printout for event day in Irrua, Edo State
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 w-fit"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* The Printable Document Area */}
      <div className="bg-slate-900/90 text-white p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl print-card">
        {/* Header Banner */}
        <div className="border-b-2 border-amber-400 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
              Official Family Planning Document • Confidential
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {settings.honoree}
            </h1>
            <p className="text-sm text-slate-300">
              Catholic Funeral Mass, Solemn Interment & Reception Dossier
            </p>
          </div>

          <div className="text-right text-xs text-slate-300 space-y-1">
            <p><strong>Date:</strong> Friday, 30 October 2026</p>
            <p><strong>Location:</strong> Irrua, Edo State, Nigeria</p>
            <p><strong>Expected Reception Guests:</strong> ~500</p>
          </div>
        </div>

        {/* Section 1: Financial Architecture */}
        <div className="mb-8">
          <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 border-b border-slate-700 pb-2 mb-4">
            1. Financial Summary & Budget Ledger
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase">Base Subtotal</span>
              <p className="text-base font-bold text-white font-mono mt-1">
                ₦{financialMetrics.baseSubtotal.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-purple-300 uppercase">Residence Renovation</span>
              <p className="text-base font-bold text-purple-300 font-mono mt-1">
                ₦{financialMetrics.renovationAllowance.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-amber-400 uppercase">10% Contingency</span>
              <p className="text-base font-bold text-amber-400 font-mono mt-1">
                ₦{financialMetrics.contingencyAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Working Total</span>
              <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                ₦{financialMetrics.workingTotal.toLocaleString()}
              </p>
              <span className="text-[9px] text-slate-400">₦{financialMetrics.costPerGuest.toLocaleString()} / guest</span>
            </div>
          </div>

          <table className="w-full text-left text-xs mb-4">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
                <th className="py-2">Item</th>
                <th className="py-2">Category</th>
                <th className="py-2">Allowance (₦)</th>
                <th className="py-2">Paid (₦)</th>
                <th className="py-2">Balance Due (₦)</th>
                <th className="py-2">Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
              {budgetItems.slice(0, 12).map((item) => (
                <tr key={item.id} className="text-[11px]">
                  <td className="py-1.5 font-sans font-medium text-white">{item.name}</td>
                  <td className="py-1.5 font-sans text-slate-400">{item.category}</td>
                  <td className="py-1.5">₦{item.provisionalAllowance.toLocaleString()}</td>
                  <td className="py-1.5 text-emerald-400">₦{(item.amountPaid || 0).toLocaleString()}</td>
                  <td className="py-1.5 text-amber-400">
                    ₦{Math.max(0, item.provisionalAllowance - (item.amountPaid || 0)).toLocaleString()}
                  </td>
                  <td className="py-1.5 font-sans text-slate-400">{item.assignedLead || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-400 italic">
            * Complete 28 line items logged in online committee ledger.
          </p>
        </div>

        {/* Section 2: Day-of Programme (Offline Essential) */}
        <div className="mb-8 break-inside-avoid">
          <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 border-b border-slate-700 pb-2 mb-4">
            2. Official Day-of Burial Timetable
          </h3>

          <div className="space-y-2 text-xs">
            {programme.map((act) => (
              <div
                key={act.id}
                className="bg-slate-950/60 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {act.order}
                  </span>
                  <div>
                    <p className="font-bold text-white text-xs">{act.activity}</p>
                    <p className="text-[11px] text-slate-400">{act.location}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono text-amber-300 font-bold">
                  {act.time} ({act.duration})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Key Committee Workstream Leads & Offline Contacts */}
        <div className="break-inside-avoid">
          <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 border-b border-slate-700 pb-2 mb-4">
            3. Workstream Leads & Emergency Contacts (Irrua)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Event Coordination</span>
              <p className="font-bold text-white">Uwade Akhabue</p>
              <p className="text-slate-400 text-[11px]">{settings.contactPhone}</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Treasurer & Records</span>
              <p className="font-bold text-white">Otibhor Akhabue</p>
              <p className="text-slate-400 text-[11px]">+234 802 345 6789</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Mortuary & Escort</span>
              <p className="font-bold text-white">Oziegbe E Akhabue</p>
              <p className="text-slate-400 text-[11px]">+234 807 567 8901</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Food & Hospitality</span>
              <p className="font-bold text-white">Odion Akhabue</p>
              <p className="text-slate-400 text-[11px]">+234 809 678 9012</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Church & Liturgy</span>
              <p className="font-bold text-white">Omozele Akhabue</p>
              <p className="text-slate-400 text-[11px]">+234 805 456 7890</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Residence Renovation</span>
              <p className="font-bold text-white">Akhere Akhabue</p>
              <p className="text-slate-400 text-[11px]">+234 814 789 0123</p>
            </div>
          </div>
        </div>

        {/* Footer Sign-Off in Printout */}
        <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between text-[11px] text-slate-400">
          <span>Akhabue Family Planning Portal • Generated for Event Field Logistics</span>
          <span>Approved: Family Council Consensus</span>
        </div>
      </div>
    </div>
  );
};
