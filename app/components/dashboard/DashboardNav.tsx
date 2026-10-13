"use client";

import React from "react";
import { usePlanner } from "../../context/PlannerContext";
import { DashboardSection } from "../../types";
import {
  LayoutDashboard,
  Calculator,
  Users,
  CheckSquare,
  ShoppingBag,
  Home,
  Truck,
  CalendarDays,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Printer,
  ShieldAlert,
  KeyRound,
  UserPlus,
} from "lucide-react";

export const DashboardNav: React.FC = () => {
  const {
    dashboardSection,
    setDashboardSection,
    financialMetrics,
    tasks,
    budgetItems,
    renovationItems,
    decisions,
    userRole,
    familyMembers,
  } = usePlanner();

  const pendingTasksCount = tasks.filter((t) => t.status !== "Completed").length;
  const pendingApprovalsCount = decisions.filter((d) => d.status !== "Approved").length;

  const navItems: { id: DashboardSection; label: string; icon: any; badge?: string | number; badgeColor?: string }[] = [
    { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
    {
      id: "children",
      label: "Children & Access Codes",
      icon: KeyRound,
      badge: `${familyMembers.length} codes`,
      badgeColor: "bg-amber-500/20 text-amber-300",
    },
    {
      id: "budget",
      label: "Budget & Expenses",
      icon: Calculator,
      badge: "₦0",
      badgeColor: "bg-blue-500/20 text-blue-300",
    },
    { id: "purchases", label: "Shopping List", icon: ShoppingBag },
    {
      id: "renovation",
      label: "Residence Renovation",
      icon: Home,
      badge: "₦500k",
      badgeColor: "bg-purple-500/20 text-purple-300",
    },
    { id: "vendors", label: "Vendor Directory", icon: Truck },
    { id: "programme", label: "Burial Programme", icon: CalendarDays },
    { id: "documents", label: "Receipts & Vault", icon: FileText },
    {
      id: "approvals",
      label: "Family Decisions",
      icon: FileCheck2,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} req` : undefined,
      badgeColor: "bg-rose-500/20 text-rose-300",
    },
    { id: "reports", label: "Print & Export", icon: Printer },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/90 border-r border-white/10 p-3 sm:p-4 flex-shrink-0 flex flex-col justify-between">
      <div>
        <div className="px-3 py-2 mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Family Management
          </p>
          <p className="text-xs text-slate-400">
            Restricted Family Planning Portal
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = dashboardSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setDashboardSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Notice & Security Warning */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 px-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Access Restricted</span>
        </div>
        <p className="text-slate-500 leading-snug">
          Logged in as <strong className="text-slate-300 capitalize">{userRole}</strong>. Sibling balances and expense ledgers are hidden from guests.
        </p>
      </div>
    </aside>
  );
};
