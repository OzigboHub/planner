"use client";

import React, { useState, useMemo } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { BudgetItem, FamilyMember } from "../../types";
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  Users,
  Copy,
  Check,
  Share2,
  Trash2,
  Edit2,
  Lock,
  ShieldCheck,
  Eye,
  AlertCircle,
  X,
  Phone,
  Printer,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const SimplePlannerView: React.FC = () => {
  const {
    budgetItems,
    toggleBudgetItemDone,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    isAdmin,
    canEdit,
    authenticatedMember,
    familyMembers,
    addFamilyMember,
    deleteFamilyMember,
    settings,
    getInvitationUrl,
    userRole,
    setUserRole,
  } = usePlanner();

  // Filter & Search State
  const [filterTab, setFilterTab] = useState<"all" | "done" | "left">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modals
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [isChildrenModalOpen, setIsChildrenModalOpen] = useState(false);

  // Add/Edit Item Form State
  const [itemForm, setItemForm] = useState({
    name: "",
    category: "Logistics & Mortuary",
    amount: "",
    amountPaid: "",
    isDone: false,
    notes: "",
  });

  // Onboard Child Form State
  const [newChildName, setNewChildName] = useState("");
  const [newChildPhone, setNewChildPhone] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Financial Calculations
  const calculatedItems = useMemo(() => {
    return budgetItems.map((item) => {
      const totalCost = item.actualCost ?? item.quotedAmount ?? item.provisionalAllowance;
      const paid = item.amountPaid || 0;
      const isDone = item.isDone !== undefined ? item.isDone : item.paidStatus === "Paid";
      const balance = Math.max(0, totalCost - paid);
      return {
        ...item,
        totalCost,
        amountPaid: paid,
        isDone,
        balance,
      };
    });
  }, [budgetItems]);

  const totalBudget = useMemo(() => {
    return calculatedItems.reduce((acc, curr) => acc + curr.totalCost, 0);
  }, [calculatedItems]);

  const totalPaid = useMemo(() => {
    return calculatedItems.reduce((acc, curr) => acc + curr.amountPaid, 0);
  }, [calculatedItems]);

  const totalBalanceRemaining = useMemo(() => {
    return calculatedItems.reduce((acc, curr) => acc + curr.balance, 0);
  }, [calculatedItems]);

  const doneCount = useMemo(() => {
    return calculatedItems.filter((i) => i.isDone).length;
  }, [calculatedItems]);

  const leftCount = useMemo(() => {
    return calculatedItems.filter((i) => !i.isDone).length;
  }, [calculatedItems]);

  const percentDone = calculatedItems.length > 0 ? Math.round((doneCount / calculatedItems.length) * 100) : 0;

  // Filtered List
  const categories = useMemo(() => {
    const set = new Set(budgetItems.map((i) => i.category));
    return Array.from(set);
  }, [budgetItems]);

  const filteredItems = useMemo(() => {
    return calculatedItems.filter((item) => {
      // Tab filter: Done vs Left
      if (filterTab === "done" && !item.isDone) return false;
      if (filterTab === "left" && item.isDone) return false;

      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query) || false;
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesNotes || matchesCat;
      }

      return true;
    });
  }, [calculatedItems, filterTab, selectedCategory, searchQuery]);

  // Handlers
  const handleToggleDone = (id: string) => {
    if (!isAdmin && !canEdit) {
      alert("Only authorized committee coordinators can tick what has been done and what is left.");
      return;
    }
    toggleBudgetItemDone(id);
  };

  const handleOpenAddModal = () => {
    if (!isAdmin && !canEdit) {
      alert("Only authorized Family Admins can add planning items.");
      return;
    }
    setEditingItem(null);
    setItemForm({
      name: "",
      category: "Food & Catering",
      amount: "",
      amountPaid: "0",
      isDone: false,
      notes: "",
    });
    setIsAddItemModalOpen(true);
  };

  const handleOpenEditModal = (item: BudgetItem) => {
    if (!isAdmin && !canEdit) {
      alert("Only authorized Family Admins can edit planning items.");
      return;
    }
    setEditingItem(item);
    const totalCost = item.actualCost ?? item.quotedAmount ?? item.provisionalAllowance;
    setItemForm({
      name: item.name,
      category: item.category,
      amount: totalCost.toString(),
      amountPaid: (item.amountPaid || 0).toString(),
      isDone: item.isDone !== undefined ? item.isDone : item.paidStatus === "Paid",
      notes: item.notes || "",
    });
    setIsAddItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin && !canEdit) {
      alert("Only authorized Family Admins can add or update planning amounts. Please log in with an Administrator account.");
      return;
    }
    if (!itemForm.name.trim() || !itemForm.amount.trim()) return;

    const amountNum = parseFloat(itemForm.amount.replace(/[^0-9.]/g, "")) || 0;
    const paidNum = parseFloat(itemForm.amountPaid.replace(/[^0-9.]/g, "")) || 0;
    const isDone = itemForm.isDone || paidNum >= amountNum;

    if (editingItem) {
      updateBudgetItem(editingItem.id, {
        name: itemForm.name.trim(),
        category: itemForm.category as any,
        provisionalAllowance: amountNum,
        actualCost: amountNum,
        amountPaid: paidNum,
        isDone,
        paidStatus: isDone ? "Paid" : paidNum > 0 ? "Partial" : "Unpaid",
        notes: itemForm.notes.trim() || undefined,
      });
    } else {
      addBudgetItem({
        name: itemForm.name.trim(),
        category: itemForm.category as any,
        provisionalAllowance: amountNum,
        actualCost: amountNum,
        amountPaid: paidNum,
        isDone,
        paidStatus: isDone ? "Paid" : paidNum > 0 ? "Partial" : "Unpaid",
        notes: itemForm.notes.trim() || undefined,
      });
    }

    setIsAddItemModalOpen(false);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (!isAdmin && !canEdit) {
      alert("Only authorized Family Admins can remove planning items.");
      return;
    }
    if (confirm(`Remove "${name}" from the burial planner?`)) {
      deleteBudgetItem(id);
    }
  };

  // Add Child Submission
  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const cleanName = newChildName.trim();
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    addFamilyMember({
      name: cleanName,
      relationship: "Child • Sibling",
      phone: newChildPhone.trim() || "+234 800 000 0000",
      loginCode: code,
      status: "Active",
      permission: "view_only",
      notes: "Registered child with view-only planning access.",
    });

    setSuccessMessage(`Child onboarded! 6-Digit Access PIN: ${code}`);
    setNewChildName("");
    setNewChildPhone("");
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const copyChildInvite = (child: FamilyMember) => {
    const inviteUrl = getInvitationUrl().replace("/invite", "");
    const text = `Hello ${child.name},\nHere is your private access code to view the burial planning for our father, Late MrFestus Okoruwa Akhabue:\n\nAccess Code: ${child.loginCode}\nPlanning Portal: ${inviteUrl}\n\nYou can log in to view what has been done, what is left, and the remaining balances.`;
    navigator.clipboard.writeText(text);
    setCopiedCodeId(child.id);
    setTimeout(() => setCopiedCodeId(null), 3000);
  };

  const shareChildWhatsApp = (child: FamilyMember) => {
    const inviteUrl = getInvitationUrl().replace("/invite", "");
    const text = encodeURIComponent(
      `Hello ${child.name},\nHere is your access code to view our father's burial arrangements (Late MrFestus Okoruwa Akhabue):\n\nAccess Code: *${child.loginCode}*\nPlanning Portal: ${inviteUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-2.5 sm:px-4 py-3 sm:py-8 space-y-3.5 sm:space-y-6 w-full overflow-x-hidden">
      {/* 1. Header Banner & Permissions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-white/10 shadow-xl">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Burial Planning Checklist
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[10px] text-slate-400 truncate max-w-full">
              St. Matthew Catholic Church &amp; Akhabue Compound
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            Arrangements for {settings.honoree}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Tick what has been done, inspect what is left, and track payments &amp; balances.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add Item</span>
              </button>
              <button
                onClick={() => setIsChildrenModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20"
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Children ({familyMembers.length})</span>
              </button>
            </>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            title="Print Summary"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Role explanation indicator */}
      <div
        className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border flex items-center gap-2 text-xs ${
          isAdmin
            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
            : "bg-amber-500/10 border-amber-500/30 text-amber-300"
        }`}
      >
        {isAdmin ? (
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
        ) : (
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
        )}
        <span className="leading-snug">
          {isAdmin ? (
            <>
              <strong>Administrator Access:</strong> Only you can put amounts, update expenses, and tick what has been done.
            </>
          ) : (
            <>
              <strong>View-Only Child Access ({authenticatedMember || "Family Member"}):</strong> You can inspect the checklist and balances. Only the Administrator can input amounts or modify items.
            </>
          )}
        </span>
      </div>

      {/* 2. Top Summary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        {/* Total Budget */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total Burial Budget</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {calculatedItems.length} items
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            ₦{totalBudget.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Total estimated cost of all funeral arrangements
          </p>
        </div>

        {/* What Has Been Done */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>What Has Been Done</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
              {doneCount} done
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            ₦{totalPaid.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-300/70 mt-1">
            Amount paid so far ({percentDone}% completed)
          </p>
        </div>

        {/* What Is Left */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>What Is Left</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300">
              {leftCount} left
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
            ₦{totalBalanceRemaining.toLocaleString()}
          </p>
          <p className="text-[11px] text-amber-300/70 mt-1">
            Total balance remaining to be cleared
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Overall Burial Progress</span>
          <span className="text-emerald-400 font-bold">{doneCount} of {calculatedItems.length} items ({percentDone}%)</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${percentDone}%` }}
          />
        </div>
      </div>

      {/* 3. Filters: Done vs Left Tabs, Search, and Category */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pt-1">
        {/* Main Tab Switch: All vs Done vs Left */}
        <div className="grid grid-cols-3 p-1 bg-slate-900 rounded-xl border border-white/10 w-full md:w-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
              filterTab === "all"
                ? "bg-slate-700 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>All ({calculatedItems.length})</span>
          </button>
          <button
            onClick={() => setFilterTab("done")}
            className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              filterTab === "done"
                ? "bg-emerald-600 text-white shadow font-bold"
                : "text-slate-400 hover:text-emerald-300"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">What Has Been Done</span>
            <span className="sm:hidden">Done</span>
            <span>({doneCount})</span>
          </button>
          <button
            onClick={() => setFilterTab("left")}
            className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              filterTab === "left"
                ? "bg-amber-600 text-white shadow font-bold"
                : "text-slate-400 hover:text-amber-300"
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">What Is Left</span>
            <span className="sm:hidden">Left</span>
            <span>({leftCount})</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items (e.g. Casket, Rice...)"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:border-amber-400 truncate"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. The Checklist Items List */}
      <div className="space-y-2 sm:space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-slate-900/50 border border-white/5">
            <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-300">No items found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or tab filter.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 ${
                item.isDone
                  ? "bg-slate-900/80 border-emerald-500/30 hover:border-emerald-500/50"
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Left: Tick Box & Item Details */}
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                {/* Checkbox (Only Admin can tick/untick) */}
                <button
                  type="button"
                  onClick={() => handleToggleDone(item.id)}
                  className={`mt-0.5 p-0.5 rounded-lg transition-transform active:scale-95 flex-shrink-0 ${
                    isAdmin ? "cursor-pointer" : "cursor-default"
                  }`}
                  title={
                    isAdmin
                      ? item.isDone
                        ? "Click to mark as Left / Pending"
                        : "Click to tick as Done / Settled"
                      : "Only the Administrator can tick what has been done"
                  }
                >
                  {item.isDone ? (
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 hover:text-amber-400" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight break-words ${
                        item.isDone ? "text-slate-300 line-through decoration-slate-600" : "text-white"
                      }`}
                    >
                      {item.name}
                    </h3>

                    {/* Status Pill */}
                    {item.isDone ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shrink-0">
                        <Check className="w-2.5 h-2.5" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Left</span>
                      </span>
                    )}

                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium shrink-0">
                      {item.category}
                    </span>
                  </div>

                  {/* Notes / Remarks */}
                  {item.notes && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed break-words">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Amounts, Balance, and Admin Controls */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5 gap-1.5 flex-shrink-0">
                <div className="flex sm:block items-baseline gap-1">
                  <span className="text-[11px] sm:text-xs text-slate-400">Cost:</span>
                  <span className="text-sm sm:text-lg font-extrabold text-white">
                    ₦{item.totalCost.toLocaleString()}
                  </span>
                </div>

                {/* Plain, simple payment & balance breakdown */}
                <div className="text-right text-[11px] sm:text-xs">
                  {item.totalCost === 0 ? (
                    <span className="text-slate-500 italic text-[10px] sm:text-[11px]">
                      Pending Admin Quote
                    </span>
                  ) : item.balance === 0 ? (
                    <span className="font-bold text-emerald-400 flex items-center justify-end gap-1">
                      <Check className="w-3 h-3 shrink-0" />
                      <span>₦{item.amountPaid.toLocaleString()} paid • Cleared</span>
                    </span>
                  ) : item.amountPaid > 0 ? (
                    <div className="sm:space-y-0.5 text-right">
                      <span className="text-slate-400 block sm:inline sm:mr-1">Paid: ₦{item.amountPaid.toLocaleString()} • </span>
                      <strong className="text-amber-400">Balance: ₦{item.balance.toLocaleString()}</strong>
                    </div>
                  ) : (
                    <div className="sm:space-y-0.5 text-right">
                      <strong className="text-rose-400">₦{item.balance.toLocaleString()} balance due</strong>
                    </div>
                  )}
                </div>

                {/* Admin Item Actions (Edit / Delete) */}
                {isAdmin && (
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
                      title="Edit item amount or notes"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 text-xs transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Add / Edit Item Modal (Admin Only) */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-white/10 p-6 shadow-2xl">
            <button
              onClick={() => setIsAddItemModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingItem ? "Edit Planning Item" : "Add New Planning Item"}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter the item name, estimated cost, amount paid so far, and any notes.
            </p>

            <form onSubmit={handleSaveItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g. Casket bearers, Rice, Cow, Canopies..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={itemForm.category}
                  onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Logistics & Mortuary">Logistics & Mortuary</option>
                  <option value="Church & Liturgy">Church & Liturgy</option>
                  <option value="Food & Catering">Food & Catering</option>
                  <option value="Drinks & Refreshments">Drinks & Refreshments</option>
                  <option value="Rentals & Decor">Rentals & Decor</option>
                  <option value="Sound & Power">Sound & Power</option>
                  <option value="Media & Printing">Media & Printing</option>
                  <option value="Sanitation & Logistics">Sanitation & Logistics</option>
                  <option value="Administration & Emergency">Administration & Emergency</option>
                  <option value="Family Residence Renovation">Family Residence Renovation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Amount (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={itemForm.amount}
                    onChange={(e) => setItemForm({ ...itemForm, amount: e.target.value })}
                    placeholder="250000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount Paid (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={itemForm.amountPaid}
                    onChange={(e) => setItemForm({ ...itemForm, amountPaid: e.target.value })}
                    placeholder="100000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Calculated Balance Preview */}
              {itemForm.amount && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs flex justify-between items-center">
                  <span className="text-slate-400">Balance Remaining:</span>
                  <span className="font-bold text-amber-400">
                    ₦
                    {Math.max(
                      0,
                      (parseFloat(itemForm.amount) || 0) - (parseFloat(itemForm.amountPaid) || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="markDoneCheckbox"
                  checked={itemForm.isDone}
                  onChange={(e) => setItemForm({ ...itemForm, isDone: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="markDoneCheckbox" className="text-xs text-slate-300 font-medium">
                  Mark as Done / Settled
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Balance Remarks
                </label>
                <textarea
                  rows={2}
                  value={itemForm.notes}
                  onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                  placeholder="e.g. Balance due on release morning at Okito Mortuary"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
                >
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Children Onboarding & Access Codes Modal */}
      {isChildrenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-indigo-500/30 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsChildrenModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Family Access Management</span>
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Children &amp; Login Access Codes
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Create login codes for the children. They will be able to log in and inspect the burial checklist in <strong>View-Only</strong> mode.
              </p>
            </div>

            {/* Quick Add Form */}
            <form
              onSubmit={handleAddChild}
              className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/20 mb-6 space-y-3"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Onboard / Add a Child</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Child&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="e.g. Uwade Akhabue"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={newChildPhone}
                    onChange={(e) => setNewChildPhone(e.target.value)}
                    placeholder="e.g. +234 803 234 5678"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                <span className="text-[11px] text-slate-500">
                  Access Code is an auto-generated 6-digit PIN (e.g. 261001)
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Child &amp; Generate PIN</span>
                </button>
              </div>
            </form>

            {successMessage && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Existing Children List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>Registered Children ({familyMembers.length})</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  All children have View-Only access
                </span>
              </h4>

              <div className="space-y-2.5">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{member.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20">
                          {member.permission === "view_and_edit" ? "Edit Authorized" : "View-Only"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{member.phone || "No phone registered"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-amber-400 tracking-wider">
                        {member.loginCode}
                      </div>

                      <button
                        onClick={() => copyChildInvite(member)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Copy Invitation message"
                      >
                        {copiedCodeId === member.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => shareChildWhatsApp(member)}
                        className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3 h-3" />
                        <span className="text-[10px]">WhatsApp</span>
                      </button>

                      {isAdmin && member.name !== "Family Committee Admin" && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${member.name}?`)) {
                              deleteFamilyMember(member.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove child"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
