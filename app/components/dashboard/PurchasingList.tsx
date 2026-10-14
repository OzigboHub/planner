"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { ShoppingItem } from "../../types";
import {
  ShoppingBag,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Receipt,
  Search,
  Eye,
} from "lucide-react";

export const PurchasingList: React.FC = () => {
  const { shoppingList, addShoppingItem, updateShoppingItem, canEdit } = usePlanner();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Shopping Item State
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Food Staples");
  const [quantity, setQuantity] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [buyer, setBuyer] = useState("");
  const [receiptNote, setReceiptNote] = useState("");

  const filteredItems = shoppingList.filter((s) =>
    s.item.toLowerCase().includes(search.toLowerCase()) ||
    s.buyer.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = shoppingList.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalEstimated = shoppingList.reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!item.trim() || !estimatedPrice) return;

    addShoppingItem({
      item: item.trim(),
      category,
      quantity: quantity.trim() || "1 lot",
      estimatedPrice: Number(estimatedPrice),
      amountPaid: 0,
      buyer: buyer.trim() || "Unassigned",
      status: "Pending Quote",
      receiptNote: receiptNote.trim() || undefined,
    });

    setIsAddOpen(false);
    setItem("");
    setQuantity("");
    setEstimatedPrice("");
    setBuyer("");
    setReceiptNote("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
            Section 3 • Procurement & Logistics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Purchasing & Shopping List
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Catering ingredients, drinks cartons, liturgical booklets, and disposables
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Add Procurement Item</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium w-fit">
            <Eye className="w-4 h-4 text-purple-400" />
            <span>View-Only Shopping List</span>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/10">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Estimated Shopping Total</p>
          <p className="text-xl font-black text-white font-mono mt-1">
            ₦{totalEstimated.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{shoppingList.length} procurement lines</p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/20">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase">Amount Paid for Purchases</p>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">
            ₦{totalSpent.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Purchases disbursed & verified</p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/20">
          <p className="text-[11px] font-semibold text-amber-300 uppercase">Pending Procurement</p>
          <p className="text-xl font-black text-amber-300 font-mono mt-1">
            ₦{Math.max(0, totalEstimated - totalSpent).toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Remaining purchases before Oct 30</p>
        </div>
      </div>

      {/* Shopping Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Item & Quantity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Est. Price (₦)</th>
                <th className="py-3 px-4">Quote / Paid (₦)</th>
                <th className="py-3 px-4">Purchased By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Receipt Reference</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredItems.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-xs">{s.item}</div>
                    <div className="text-[10px] text-amber-300 font-medium">Qty: {s.quantity}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {s.category}
                  </td>

                  <td className="py-3 px-4 font-mono font-medium">
                    ₦{s.estimatedPrice.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                    ₦{(s.amountPaid || 0).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {s.buyer}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        s.status === "Purchased" || s.status === "Received"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : s.status === "Approved"
                          ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-xs">
                    {s.receiptNote || "Pending receipt submission"}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {canEdit && s.status !== "Purchased" ? (
                      <button
                        onClick={() =>
                          updateShoppingItem(s.id, {
                            status: "Purchased",
                            amountPaid: s.supplierQuote || s.estimatedPrice,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium transition-colors"
                      >
                        Mark Purchased
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <span>Add Shopping Item</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="e.g. 50 Cartons of Malt Drinks"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50 Cartons"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated Cost (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Buyer / Assignee
                </label>
                <input
                  type="text"
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                  placeholder="e.g. Aunty Blessing"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
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
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Add to List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
