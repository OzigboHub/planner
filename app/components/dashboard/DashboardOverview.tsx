"use client";

import React from "react";
import Image from "next/image";
import { usePlanner } from "../../context/PlannerContext";
import {
  Calculator,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Home,
  DollarSign,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Calendar,
  Sparkles,
  ShieldCheck,
  KeyRound,
  UserPlus,
  Share2,
} from "lucide-react";

export const DashboardOverview: React.FC = () => {
  const {
    financialMetrics,
    settings,
    tasks,
    budgetItems,
    renovationItems,
    decisions,
    familyMembers,
    setDashboardSection,
    setCurrentView,
    setIsShareModalOpen,
  } = usePlanner();

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const urgentTasks = tasks.filter((t) => t.status !== "Completed" && t.priority === "High");

  return (
    <div className="space-y-8">
      {/* Welcome & Event Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-slate-950 shrink-0">
            <Image
              src="/pa_festus_portrait.png"
              alt={settings.honoree}
              fill
              unoptimized
              className="object-cover object-[center_16%]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
                Burial Planning Central
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-300 text-xs font-medium">Irrua, Edo State</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Family Coordination Dashboard
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Catholic Funeral Mass, Interment & Reception Planning for {settings.honoree}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setDashboardSection("children")}
            className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-2 shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Children Codes ({familyMembers.length})</span>
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Invite Guests / Share Link</span>
          </button>
          <button
            onClick={() => setDashboardSection("reports")}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Export Master PDF
          </button>
          <button
            onClick={() => setCurrentView("guest")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>View Public Guest Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Working Budget Total */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Updated Working Total
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">
            ₦{financialMetrics.workingTotal.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Includes 10% contingency</span>
            <span className="text-blue-300 font-semibold font-mono">
              (₦{financialMetrics.contingencyAmount.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Sibling Contributions */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Funds Mobilized
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            ₦{financialMetrics.totalReceived.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Funding coverage</span>
            <span className="text-emerald-400 font-bold font-mono">
              {financialMetrics.fundingCoveragePercent}% of Budget
            </span>
          </div>
        </div>

        {/* Amount Disbursed / Paid */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Disbursed / Paid
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-300 font-mono">
            ₦{financialMetrics.totalAmountPaid.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Outstanding balance due</span>
            <span className="text-amber-300 font-semibold font-mono">
              ₦{financialMetrics.totalBalanceDue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Indicative Cost Per Guest */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cost Per Guest (500)
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            ₦{financialMetrics.costPerGuest.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Includes renovation & margin</span>
            <span className="text-slate-300">500 guests planned</span>
          </div>
        </div>
      </div>

      {/* Progress & Quick Breakdown Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Financial Flow Summary */}
        <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Financial Reconciliation Status</span>
            </h3>
            <button
              onClick={() => setDashboardSection("budget")}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">
                  Sibling Pledges & Family Pool (₦{financialMetrics.totalPledged.toLocaleString()} promised)
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  ₦{financialMetrics.totalReceived.toLocaleString()} received (96%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full"
                  style={{ width: `${financialMetrics.fundingCoveragePercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">
                  Vendor & Procurement Disbursals (Total Due: ₦{(financialMetrics.totalAmountPaid + financialMetrics.totalBalanceDue).toLocaleString()})
                </span>
                <span className="text-purple-300 font-bold font-mono">
                  ₦{financialMetrics.totalAmountPaid.toLocaleString()} paid
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-500 h-2.5 rounded-full"
                  style={{
                    width: `${Math.round(
                      (financialMetrics.totalAmountPaid /
                        (financialMetrics.totalAmountPaid + financialMetrics.totalBalanceDue || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950/60 p-3 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase">Subtotal</p>
                <p className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">
                  ₦{financialMetrics.baseSubtotal.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase">Renovation Cap</p>
                <p className="text-xs sm:text-sm font-bold text-purple-300 font-mono mt-0.5">
                  ₦{financialMetrics.renovationAllowance.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase">10% Contingency</p>
                <p className="text-xs sm:text-sm font-bold text-amber-400 font-mono mt-0.5">
                  ₦{financialMetrics.contingencyAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Renovation Status Card */}
        <div className="lg:col-span-5 bg-slate-900/80 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-purple-400" />
                <span>Family Residence Renovation</span>
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                Provisional ₦500,000
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Repair items itemized to prepare ancestral compound for 500 guests and dignitaries.
            </p>

            <div className="space-y-2.5 text-xs">
              {renovationItems.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                  <div className="flex justify-between font-medium text-slate-200 mb-1">
                    <span className="truncate pr-2">{item.item}</span>
                    <span className="font-mono text-purple-300 font-bold">{item.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setDashboardSection("renovation")}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Renovation Quotes & Work</span>
            <ArrowRight className="w-3 h-3 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Urgent Tasks & Workstream Highlights */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Priority Workstream Deadlines</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {completedTasks} of {tasks.length} core tasks accomplished
            </p>
          </div>

          <button
            onClick={() => setDashboardSection("tasks")}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>All 10 Workstreams</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {urgentTasks.slice(0, 3).map((t) => (
            <div
              key={t.id}
              className="bg-slate-950/70 p-4 rounded-xl border border-white/5 hover:border-amber-400/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {t.workstream}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20">
                    {t.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">
                  {t.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{t.assignedPerson}</span>
                <span className="text-amber-300 font-medium">Due {t.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Children & Sibling Access Showcase */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Onboarded Children & Personal Access Codes</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {familyMembers.length} siblings and members issued confidential login codes for planning access
            </p>
          </div>

          <button
            onClick={() => setDashboardSection("children")}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Onboard Child & Manage All Codes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {familyMembers.slice(0, 4).map((m) => (
            <div
              key={m.id}
              className="bg-slate-950/70 p-3.5 rounded-xl border border-white/5 hover:border-amber-400/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    {m.relationship}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                    {m.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-white truncate">{m.name}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.assignedRole || m.branch}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Access Code:</span>
                <span className="font-mono text-xs font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {m.loginCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5 Privacy Enforcement Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3.5 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-slate-300">
          <p className="font-bold text-white mb-0.5">
            Privacy & Financial Safeguards Active (Section 5)
          </p>
          <p className="text-slate-400 leading-relaxed">
            Full budget details, receipts, individual sibling contribution ledgers, and contractor negotiations remain strictly restricted to authorized family members. The public guest website will never expose internal expenditure without explicit family approval.
          </p>
        </div>
      </div>
    </div>
  );
};
