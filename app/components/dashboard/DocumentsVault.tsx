"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { EventDocument } from "../../types";
import {
  FileText,
  Plus,
  Lock,
  Download,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export const DocumentsVault: React.FC = () => {
  const { documents, addDocument } = usePlanner();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventDocument["category"]>("Quotes & Invoices");
  const [uploadedBy, setUploadedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !uploadedBy.trim()) return;

    addDocument({
      title: title.trim(),
      category,
      uploadedBy: uploadedBy.trim(),
      fileSize: "1.2 MB",
      accessRestricted: true,
      notes: notes.trim() || undefined,
    });

    setIsAddOpen(false);
    setTitle("");
    setUploadedBy("");
    setNotes("");
  };

  const handleSimulatedDownload = (doc: EventDocument) => {
    setDownloadSuccess(doc.id);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Section 3 & 5 • Private Repository
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Documents, Invoices & Receipts Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Encrypted private storage for mortuary release slips, parish permits, invoices and bank proofs
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Receipt / Slip</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 hover:border-emerald-400/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {doc.category}
                </span>

                {doc.accessRestricted && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <Lock className="w-3 h-3" />
                    <span>Family Private</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">
                {doc.title}
              </h3>

              {doc.notes && (
                <p className="text-xs text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  {doc.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="space-y-0.5">
                <p>Uploaded by: <strong className="text-slate-200">{doc.uploadedBy}</strong></p>
                <p className="text-[11px] text-slate-400">{doc.uploadDate} • {doc.fileSize}</p>
              </div>

              <button
                onClick={() => handleSimulatedDownload(doc)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {downloadSuccess === doc.id ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Opened</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>View File</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Upload Event Document</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Document / Receipt Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Generator Diesel Supply Invoice"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="Mortuary & Clearance">Mortuary & Clearance</option>
                  <option value="Church & Liturgy">Church & Liturgy</option>
                  <option value="Quotes & Invoices">Quotes & Invoices</option>
                  <option value="Bank & Receipts">Bank & Receipts</option>
                  <option value="Legal & Permits">Legal & Permits</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Uploaded By *
                </label>
                <input
                  type="text"
                  required
                  value={uploadedBy}
                  onChange={(e) => setUploadedBy(e.target.value)}
                  placeholder="e.g. Barr. Jude"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes on verification or bank stamp..."
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
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
