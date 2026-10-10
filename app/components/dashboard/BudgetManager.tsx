"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { BudgetItem } from "../../types";
import {
  Calculator,
  Plus,
  Search,
  Filter,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingDown,
  Info,
} from "lucide-react";

export const BudgetManager: React.FC = () => {
  const {
    budgetItems,
    addBudgetItem,
    updateBudgetItem,
    recordBudgetPayment,
    deleteBudgetItem,
    financialMetrics,
    settings,
  } = usePlanner();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentModalItem, setPaymentModalItem] = useState<BudgetItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  // New Item State
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<BudgetItem["category"]>("Logistics & Mortuary");
  const [newItemAllowance, setNewItemAllowance] = useState("");
  const [newItemLead, setNewItemLead] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");

  const categories = [
    "All",
    "Logistics & Mortuary",
    "Church & Liturgy",
    "Food & Catering",
    "Drinks & Refreshments",
    "Rentals & Decor",
    "Sound & Power",
    "Sanitation & Logistics",
    "Media & Printing",
    "Administration & Emergency",
    "Family Residence Renovation",
  ];

  const filteredItems = budgetItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.assignedLead && item.assignedLead.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemAllowance) return;

    addBudgetItem({
      name: newItemName.trim(),
      category: newItemCategory,
      provisionalAllowance: Number(newItemAllowance),
      amountPaid: 0,
      paidStatus: "Unpaid",
      assignedLead: newItemLead.trim() || undefined,
      notes: newItemNotes.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setNewItemName("");
    setNewItemAllowance("");
    setNewItemLead("");
    setNewItemNotes("");
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalItem || !paymentAmount) return;

    recordBudgetPayment(paymentModalItem.id, Number(paymentAmount));
    setPaymentModalItem(null);
    setPaymentAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Section 6 • Financial Planning
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Family Event Budget & Expense Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Provisional planning allowances, quotes, disbursements and unpaid balances
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* Financial Formula Breakdown Card (From PDF Section 6) */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
          <Info className="w-4 h-4" />
          <span>Proposal Approved Budget Architecture</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-slate-400 uppercase">Burial & Reception Subtotal</p>
            <p className="text-sm sm:text-base font-extrabold text-white font-mono mt-1">
              ₦{financialMetrics.baseSubtotal.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">27 Provisional items</p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-purple-500/20">
            <p className="text-[10px] text-purple-300 uppercase">Mini-Renovation Allowance</p>
            <p className="text-sm sm:text-base font-extrabold text-purple-300 font-mono mt-1">
              ₦{financialMetrics.renovationAllowance.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Provisional Cap</p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-slate-400 uppercase">Updated Subtotal</p>
            <p className="text-sm sm:text-base font-extrabold text-white font-mono mt-1">
              ₦{financialMetrics.provisionalSubtotal.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Before contingency</p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/20">
            <p className="text-[10px] text-amber-300 uppercase">10% Contingency</p>
            <p className="text-sm sm:text-base font-extrabold text-amber-400 font-mono mt-1">
              ₦{financialMetrics.contingencyAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Safety buffer</p>
          </div>

          <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-3 rounded-xl border border-blue-400/30 col-span-2 sm:col-span-1">
            <p className="text-[10px] text-blue-300 uppercase font-bold">Updated Working Total</p>
            <p className="text-base sm:text-lg font-black text-amber-300 font-mono mt-1">
              ₦{financialMetrics.workingTotal.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-300 mt-0.5 font-medium">
              ₦{financialMetrics.costPerGuest.toLocaleString()} / guest
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expense item or lead..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Item & Category</th>
                <th className="py-3 px-4">Provisional Allowance</th>
                <th className="py-3 px-4">Quoted / Actual</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Lead</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredItems.map((item) => {
                const targetCost = item.actualCost ?? item.quotedAmount ?? item.provisionalAllowance;
                const balance = Math.max(0, targetCost - (item.amountPaid || 0));

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                      {item.notes && (
                        <div className="text-[10px] text-slate-500 italic mt-0.5 truncate max-w-xs">
                          {item.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium">
                      ₦{item.provisionalAllowance.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      ₦{targetCost.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                      ₦{(item.amountPaid || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-amber-400 font-semibold">
                      ₦{balance.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.paidStatus === "Paid"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : item.paidStatus === "Partial"
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {item.paidStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {item.assignedLead || "—"}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setPaymentModalItem(item);
                          setPaymentAmount("");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-colors"
                      >
                        Record Pay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Record Payment Disbursement</span>
              </h3>
              <button
                onClick={() => setPaymentModalItem(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-2">
              Disbursing funds for: <strong className="text-white">{paymentModalItem.name}</strong>
            </p>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Current Paid: ₦{(paymentModalItem.amountPaid || 0).toLocaleString()} • Provisional: ₦{paymentModalItem.provisionalAllowance.toLocaleString()}
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Amount (₦) *
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalItem(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Add New Expense Allowance</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Casket Purchase (Outstanding)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Provisional Allowance (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newItemAllowance}
                    onChange={(e) => setNewItemAllowance(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assigned Lead / Person
                </label>
                <input
                  type="text"
                  value={newItemLead}
                  onChange={(e) => setNewItemLead(e.target.value)}
                  placeholder="e.g. Uncle Patrick"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Specification
                </label>
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="Provisional estimate pending local quotation..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
