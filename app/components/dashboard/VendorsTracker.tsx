"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { VendorItem } from "../../types";
import {
  Truck,
  Plus,
  Phone,
  User,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  Eye,
} from "lucide-react";

export const VendorsTracker: React.FC = () => {
  const { vendors, addVendor, updateVendor, canEdit } = usePlanner();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [category, setCategory] = useState("Canopies & Rentals");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [quote, setQuote] = useState("");
  const [deposit, setDeposit] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!vendorName.trim() || !quote) return;

    const q = Number(quote) || 0;
    const d = Number(deposit) || 0;
    const bal = Math.max(0, q - d);

    addVendor({
      vendorName: vendorName.trim(),
      serviceCategory: category,
      contactPerson: contactPerson.trim() || "Manager",
      phone: phone.trim() || "+234",
      quotedAmount: q,
      depositPaid: d,
      balanceDue: bal,
      bookingStatus: d > 0 ? "Deposit Paid" : "Quoted",
      confirmationDate: "2026-10-10",
      notes: notes.trim() || undefined,
    });

    setIsAddOpen(false);
    setVendorName("");
    setContactPerson("");
    setPhone("");
    setQuote("");
    setDeposit("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Section 3 • Service Providers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Vendor Directory & Quotation Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Mortuary, hearse transport, casket brigade, canopies, catering and sound contracts
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Register Vendor</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium w-fit">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>View-Only Vendor Directory</span>
          </div>
        )}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <div
            key={v.id}
            className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 hover:border-blue-400/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {v.serviceCategory}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    v.bookingStatus === "Confirmed"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  }`}
                >
                  {v.bookingStatus}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                {v.vendorName}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact: {v.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <a href={`tel:${v.phone}`} className="text-slate-200 hover:text-white font-mono">
                    {v.phone}
                  </a>
                </div>
              </div>

              {/* Financial Box */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 space-y-1 text-xs font-mono mb-3">
                <div className="flex justify-between text-slate-400">
                  <span>Contract Quote:</span>
                  <span className="text-white font-bold">₦{v.quotedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Deposit Paid:</span>
                  <span>₦{v.depositPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold pt-1 border-t border-slate-800">
                  <span>Balance Due:</span>
                  <span>₦{v.balanceDue.toLocaleString()}</span>
                </div>
              </div>

              {v.notes && (
                <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-lg border border-white/5 mb-3">
                  {v.notes}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Confirmed: {v.confirmationDate || "Pending"}</span>
              {canEdit && v.bookingStatus !== "Confirmed" && (
                <button
                  onClick={() => updateVendor(v.id, { bookingStatus: "Confirmed" })}
                  className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[10px] font-semibold"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Register Service Provider</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vendor / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Irrua Grand Event Rentals"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Service Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Canopies & Chairs"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Mrs. Angela"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quoted Fee (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="250000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Deposit Paid (₦)
                  </label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Agreement Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Delivery by 4:00 PM Thursday Oct 29"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
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
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
